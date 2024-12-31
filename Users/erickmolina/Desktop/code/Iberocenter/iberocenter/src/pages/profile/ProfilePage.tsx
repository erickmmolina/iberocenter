import { useEffect } from 'react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { useProfile } from '../../lib/profile/hooks';

export function ProfilePage() {
  const { profile, loading } = useProfile();

  useEffect(() => {
    // Aquí podríamos manejar lógica adicional si hiciera falta,
    // pero useProfile ya maneja la suscripción y actualización del perfil.
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No se encontró el perfil
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <ProfileHeader profile={profile} />
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}