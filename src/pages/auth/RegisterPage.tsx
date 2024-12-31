import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { registerUser } from '../../lib/auth/registration';
import { AuthLogger } from '../../lib/auth/logger';
import { 
  UserForm, 
  CompanyForm, 
  OnboardingProgress 
} from '../../lib/auth/onboarding';
import type { OnboardingState } from '../../lib/auth/onboarding';

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleUserSubmit = () => {
    setState(prev => ({ ...prev, step: 'company' }));
  };

  const handleCompanySubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: registrationError } = await registerUser({
        email: state.userData.email,
        password: state.userData.password,
        name: state.userData.name,
        company_name: state.companyData.name,
        company_tax_id: state.companyData.tax_id
      });

      if (registrationError) {
        setError(registrationError.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      AuthLogger.error('Registration error', err);
      setError('Error inesperado al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Comienza tu prueba gratuita"
    >
      <OnboardingProgress currentStep={state.step} />

      {state.step === 'user' ? (
        <UserForm
          data={state.userData}
          onChange={userData => setState(prev => ({ ...prev, userData }))}
          onSubmit={handleUserSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <CompanyForm
          data={state.companyData}
          onChange={companyData => setState(prev => ({ ...prev, companyData }))}
          onSubmit={handleCompanySubmit}
          onBack={() => setState(prev => ({ ...prev, step: 'user' }))}
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