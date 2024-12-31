import { Phone, Clock } from 'lucide-react';

interface CallStatsProps {
  totalCalls: number;
  totalDuration: string;
}

export function CallStats({ totalCalls, totalDuration }: CallStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Llamadas totales</p>
            <p className="text-2xl font-bold">{totalCalls}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tiempo hablado</p>
            <p className="text-2xl font-bold">{totalDuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}