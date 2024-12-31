import { ChevronDown } from 'lucide-react';

const countries = [
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'ES', name: 'España', prefix: '+34' },
  { code: 'MX', name: 'México', prefix: '+52' },
];

interface CountrySelectProps {
  selected: string;
  onSelect: (prefix: string) => void;
}

export function CountrySelect({ selected, onSelect }: CountrySelectProps) {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
        onClick={() => {/* Implementar dropdown */}}
      >
        <img
          src={`https://flagcdn.com/w20/${selected.toLowerCase()}.png`}
          alt="Country flag"
          className="w-5 h-auto"
        />
        <span className="text-sm font-medium">
          {countries.find(c => c.code === selected)?.prefix}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}