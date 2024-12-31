import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationsButtonProps {
  count?: number;
}

export function NotificationsButton({ count }: NotificationsButtonProps) {
  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
      <Bell className="w-5 h-5" />
      {count && count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}