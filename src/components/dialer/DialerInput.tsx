import React from 'react';
import { CountrySelect } from './CountrySelect';

interface DialerInputProps {
  phoneNumber: string;
  selectedCountry: string;
  onPhoneNumberChange: (value: string) => void;
  onCountrySelect: (country: string) => void;
}

export function DialerInput({
  phoneNumber,
  selectedCountry,
  onPhoneNumberChange,
  onCountrySelect
}: DialerInputProps) {
  return (
    <div className="flex gap-2 mb-4">
      <CountrySelect
        selected={selectedCountry}
        onSelect={onCountrySelect}
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        placeholder="Ingresa un número"
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}