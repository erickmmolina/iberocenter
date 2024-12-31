import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { AuthLogger } from '../../lib/auth/logger';
import { UserForm, CompanyForm, OnboardingProgress } from '../../lib/auth/onboarding';
import type { OnboardingState } from '../../lib/auth/onboarding';
import { supabase } from '../../lib/supabase';

/**
 * signUpStepOne
 * Realiza solo la creación de usuario en Supabase Auth
 * para que podamos validar si el correo ya está usado.
 */
async function signUpStepOne(email: string, password: string, name: string) {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          // Podemos guardar metadata básica
          name,
        }
      }
    });

  if (error) {
    // Manejo de error: "User already registered"
    if (
      error.message?.includes('User already registered') ||
      error.message?.includes('user_already_exists')
    ) {
      // 1. Verificamos si hay fila en 'profiles'
      //    => Buscar supabase.from('profiles').select('id').eq('email', email).maybeSingle()
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
  
      if (!existingProfile) {
        // el usuario existe en auth.users pero no en profiles => "registro a medias"
        return { partial: true };
      } else {
        // el perfil ya existe => registro completo => "ya está registrado"
        return {
          error: { message: 'Este correo ya está registrado. Por favor, inicia sesión.' },
        };
      }
  
      // Otras causas
      return { error: { message: error.message } };
    }
  }


    if (!authData.user) {
      return { error: { message: 'No se obtuvo información de usuario al registrarse' } };
    }

    // Sign up correcto
    return { user: authData.user };
  } catch (err: any) {
    AuthLogger.error('Error inesperado al crear usuario (step 1)', err);
    return { error: { message: 'Error inesperado al crear la cuenta' } };
  }
}

/**
 * createCompanyAndProfile
 * Crea la empresa y el perfil en la BD, usando userId ya existente
 */
async function createCompanyAndProfile(userId: string, name: string, email: string, companyName: string, companyTaxId: string) {
  try {
    // 1. Insertar la empresa
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        tax_id: companyTaxId
      })
      .select()
      .single();

    if (companyError) {
      return { error: { message: 'Error al crear la empresa' } };
    }

    // 2. Crear el perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
        email,
        company_id: company.id,
        role: 'admin'
      });

    if (profileError) {
      return { error: { message: 'Error al crear el perfil' } };
    }

    // 3. Actualizar metadata de usuario si lo deseas
    await supabase.auth.updateUser({
      data: {
        name,
        company_id: company.id,
        role: 'admin'
      }
    });

    return {};
  } catch (err: any) {
    AuthLogger.error('Error inesperado al crear empresa/perfil (step 2)', err);
    return { error: { message: 'Error inesperado al crear empresa/perfil' } };
  }
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para los dos pasos de onboarding
  const [state, setState] = useState<OnboardingState>({
    step: 'user',
    userData: {
      name: '',
      email: '',
      password: ''
    },
    companyData: {
      name: '',
      tax_id: ''
    }
  });

  /**
   * 1) Maneja click en "Continuar" del UserForm
   * Hace signUp en Supabase para validar inmediatamente si el correo ya está en uso
   */
const handleUserSubmit = async () => {
  setError('');
  setLoading(true);

  const { name, email, password } = state.userData;
  const result = await signUpStepOne(email, password, name);
  setLoading(false);

  if (result.partial) {
    // USUARIO A MEDIAS
    setError('Ya iniciaste el registro con este correo. Por favor, inicia sesión para completarlo.');
    // Podrías mostrar un botón que redirija a /auth/login
    return;
  }

  if (result.error) {
    setError(result.error.message);
    return;
  }

  // Avanzar al paso 2 si no hubo error
  setState((prev) => ({ ...prev, step: 'company' }));
};

  /**
   * 2) Maneja click en "Crear cuenta" del CompanyForm
   * Crea la empresa y el perfil, usando el userId ya generado en el paso anterior.
   */
  const handleCompanySubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No hay un usuario autenticado. Repite el primer paso o intenta de nuevo.');
        setLoading(false);
        return;
      }
    
      const { name, email, password } = state.userData; // Asegúrate de extraer también 'password'
      const { name: companyName, tax_id } = state.companyData;
    
      const result = await createCompanyAndProfile(user.id, name, email, companyName, tax_id);
      if (result.error) {
        setError(result.error.message);
      } else {
        // => Nuevo código: iniciamos sesión automáticamente usando los datos ingresados
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      AuthLogger.error('Registration error (CompanySubmit)', err);
      setError('Error inesperado al crear la cuenta');
    } finally {
      setLoading(false);
    }};

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Comienza tu prueba gratuita"
    >
      <OnboardingProgress currentStep={state.step} />

      {state.step === 'user' ? (
        <UserForm
          data={state.userData}
          onChange={(userData) => setState((prev) => ({ ...prev, userData }))}
          onSubmit={handleUserSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <CompanyForm
          data={state.companyData}
          onChange={(companyData) => setState((prev) => ({ ...prev, companyData }))}
          onSubmit={handleCompanySubmit}
          onBack={() => setState((prev) => ({ ...prev, step: 'user' }))}
          loading={loading}
          error={error}
        />
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
