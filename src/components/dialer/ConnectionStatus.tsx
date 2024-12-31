import { Signal, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';

interface ConnectionStatusProps {
  strength: 'low' | 'medium' | 'high' | 'none';
}

export function ConnectionStatus({ strength }: ConnectionStatusProps) {
  const getSignalIcon = () => {
    switch (strength) {
      case 'high':
        return <SignalHigh className="w-4 h-4 text-green-500" />;
      case 'medium':
        return <SignalMedium className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <SignalLow className="w-4 h-4 text-red-500" />;
      default:
        return <Signal className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center gap-1">
      {getSignalIcon()}
      <span className="text-xs text-gray-500">
        {strength === 'none' ? 'Sin conexión' : 'Conectado'}
      </span>
    </div>
  );
}