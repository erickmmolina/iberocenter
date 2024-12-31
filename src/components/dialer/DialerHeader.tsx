import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';

interface DialerHeaderProps {
  onFullscreen: () => void;
  onClose: () => void;
}

export function DialerHeader({ onFullscreen, onClose }: DialerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <ConnectionStatus strength="high" />
      <div className="flex items-center gap-2">
        <button
          onClick={onFullscreen}
          className="p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}