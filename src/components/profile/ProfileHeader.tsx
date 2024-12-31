import { User } from 'lucide-react';
import type { Profile } from '../../lib/auth/types';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <User className="w-8 h-8 text-blue-600" />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-gray-500">{profile.email}</p>
        {profile.company && (
          <p className="text-sm text-gray-500">{profile.company.name}</p>
        )}
      </div>
    </div>
  );
}