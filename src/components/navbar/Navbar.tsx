import React from 'react';
import { Logo } from './Logo';
import { Balance } from './Balance';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserMenu } from './UserMenu';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <Logo />
      
      <div className="flex items-center gap-4">
        <Balance amount={3.62} />
        <NotificationsDropdown />
        <UserMenu 
          name="Erick Molina"
          email="erick@example.com"
        />
      </div>
    </nav>
  );
}