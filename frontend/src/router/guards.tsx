import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/enums';

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles?: UserRole[];
  children: JSX.Element;
}) {
  const user = useAuthStore((state) => state.user);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
