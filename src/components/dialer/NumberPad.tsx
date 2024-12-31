import React from 'react';
import { Phone } from 'lucide-react';

const dialPad = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#']
];

interface NumberPadProps {
  onPress: (key: string) => void;
}

export function NumberPad({ onPress }: NumberPadProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {dialPad.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onPress(key)}
              className="w-full h-14 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 border text-lg font-medium transition-colors"
            >
              {key}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}