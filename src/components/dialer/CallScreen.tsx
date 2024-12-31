import React from 'react';
import { Phone } from 'lucide-react';

interface CallScreenProps {
  contact?: {
    name: string;
    number: string;
  };
  onHangup: () => void;
}

export function CallScreen({ contact, onHangup }: CallScreenProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 w-full p-6 rounded-t-lg">
        {contact?.name ? (
          <>
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white text-center">{contact.name}</h2>
            <p className="text-gray-400 text-center">{contact.number}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4" />
            <p className="text-xl text-white text-center">{contact?.number}</p>
          </>
        )}
        <p className="text-gray-400 text-center mt-2">Llamada Saliente</p>
      </div>

      <div className="p-6 w-full bg-white">
        <button
          onClick={onHangup}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span>Colgar</span>
        </button>
      </div>
    </div>
  );
}