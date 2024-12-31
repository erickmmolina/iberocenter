import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { DialerHeader } from './DialerHeader';
import { DialerInput } from './DialerInput';
import { NumberPad } from './NumberPad';
import { CallScreen } from './CallScreen';

interface DialerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Dialer({ isOpen, onClose }: DialerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CL');
  const [isInCall, setIsInCall] = useState(false);
  const [currentContact, setCurrentContact] = useState<{ name?: string; number: string } | null>(null);

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    setPhoneNumber(prev => prev + key);
  };

  const handleCall = () => {
    const contact = phoneNumber === '+56912345678' 
      ? { name: 'Erick Molina', number: phoneNumber }
      : { number: phoneNumber };
    
    setCurrentContact(contact);
    setIsInCall(true);
  };

  const handleHangup = () => {
    setIsInCall(false);
    setCurrentContact(null);
  };

  return (
    <div
      className={`fixed bg-white rounded-lg shadow-xl transition-all duration-200 ${
        isFullscreen ? 'inset-0 m-4' : 'bottom-4 right-4 w-[340px]'
      }`}
    >
      <DialerHeader 
        onFullscreen={() => setIsFullscreen(!isFullscreen)}
        onClose={onClose}
      />

      {isInCall ? (
        <CallScreen 
          contact={currentContact || undefined}
          onHangup={handleHangup}
        />
      ) : (
        <div className="p-4">
          <DialerInput
            phoneNumber={phoneNumber}
            selectedCountry={selectedCountry}
            onPhoneNumberChange={setPhoneNumber}
            onCountrySelect={setSelectedCountry}
          />

          <select className="w-full px-3 py-2 mb-6 border rounded-lg bg-white">
            <option value="">Llamar desde Diseños Ventas</option>
            <option value="+56912345678">+56 9 1234 5678</option>
          </select>

          <NumberPad onPress={handleKeyPress} />

          <button 
            onClick={handleCall}
            className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Llamar</span>
          </button>
        </div>
      )}
    </div>
  );
}