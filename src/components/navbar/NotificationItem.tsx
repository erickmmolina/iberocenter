import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Notification } from '../../lib/notifications/types';

interface NotificationItemProps extends Notification {
  onRemove: () => void;
}

export function NotificationItem({ type, contact, timestamp, onRemove }: NotificationItemProps) {
  return (
    <div className="group flex items-start gap-3 p-4 hover:bg-gray-50 border-b transition-colors animate-in slide-in-from-right">
      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
        <Phone className="w-5 h-5 text-gray-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            {type === 'voicemail' ? 'Voicemail' : 'Voicemail abandonado'}
          </h4>
          <button 
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
          >
            ×
          </button>
        </div>
        
        <p className="text-blue-500 text-sm">{contact?.name || 'Desconocido'}</p>
        <p className="text-gray-600 text-sm">{contact?.number}</p>
        
        <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{format(timestamp, "yyyy-MM-dd HH:mm", { locale: es })}</span>
        </div>
      </div>
    </div>
  );
}