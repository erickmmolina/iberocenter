import { ReactNode } from 'react';
import { Navbar } from './navbar/Navbar';
import { Sidebar } from './Sidebar';
import { GuestBanner } from './GuestBanner';
import { Dialer } from './dialer/Dialer';
import { useDialer } from '../lib/dialer/store';
import { useAuth } from '../lib/auth';
import { isGuestUser } from '../lib/auth/guest';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, close } = useDialer();
  const { user } = useAuth();
  const isGuest = isGuestUser(user?.id);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {isGuest && <GuestBanner />}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        <Dialer 
          isOpen={isOpen}
          onClose={close}
        />
      </div>
    </div>
  );
}