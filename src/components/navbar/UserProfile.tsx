import React from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function UserProfile({ name, email, avatarUrl }: UserProfileProps) {
  return (
    <button className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg">
      <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}