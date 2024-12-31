import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../../lib/notifications';

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    loading, 
    markAllAsRead, 
    removeNotification,
    fetchNotifications 
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border animate-in fade-in-0 slide-in-from-top-5">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Centro de notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                className="text-blue-500 text-sm hover:text-blue-600"
                onClick={markAllAsRead}
              >
                Marcar todo como leído
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Cargando...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onRemove={() => removeNotification(notification.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}