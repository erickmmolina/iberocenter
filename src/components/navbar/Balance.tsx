import React from 'react';
import { DollarSign } from 'lucide-react';

interface BalanceProps {
  amount: number;
}

export function Balance({ amount }: BalanceProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
      <DollarSign className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium">{amount.toFixed(2)} USD</span>
    </div>
  );
}