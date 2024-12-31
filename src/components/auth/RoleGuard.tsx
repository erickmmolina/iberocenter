import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/hooks';
import type { Role } from '../../lib/auth/types';

interface RoleGuardProps {
  children: ReactNode;
  roles: Role[];
  redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = '/' }: RoleGuardProps) {
  const { hasAnyRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!hasAnyRole(roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}