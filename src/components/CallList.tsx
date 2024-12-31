import { format } from 'date-fns';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { es } from 'date-fns/locale';

interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  number: string;
  name?: string;
  timestamp: Date;
  duration?: string;
}

interface CallListProps {
  calls: Call[];
}

export function CallList({ calls }: CallListProps) {
  const getCallIcon = (type: Call['type']) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-5 h-5 text-green-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-5 h-5 text-blue-500" />;
      case 'missed':
        return <PhoneMissed className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Llamadas Recientes</h2>
      </div>
      
      <div className="divide-y">
        {calls.map((call) => (
          <div key={call.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCallIcon(call.type)}
                <div>
                  <p className="font-medium">{call.name || call.number}</p>
                  <p className="text-sm text-gray-500">
                    {format(call.timestamp, "d 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
              {call.duration && (
                <span className="text-sm text-gray-500">{call.duration}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}