import { useEffect } from 'react';
import { CallStats } from '../components/CallStats';
import { CallList } from '../components/CallList';
import { useCompanies } from '../lib/companies/store';

const mockCalls = [
  {
    id: '1',
    type: 'incoming' as const,
    number: '+34 666 777 888',
    name: 'Juan Pérez',
    timestamp: new Date('2024-02-26T10:30:00'),
    duration: '5:23'
  },
  {
    id: '2',
    type: 'outgoing' as const,
    number: '+34 999 888 777',
    timestamp: new Date('2024-02-26T09:15:00'),
    duration: '2:45'
  },
  {
    id: '3',
    type: 'missed' as const,
    number: '+34 555 444 333',
    name: 'María García',
    timestamp: new Date('2024-02-26T08:45:00'),
  }
];

export function Dashboard() {
  const { fetchCompanies } = useCompanies();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <CallStats totalCalls={15} totalDuration="1h 23m" />
        
        <CallList calls={mockCalls} />
      </div>
    </div>
  );
}