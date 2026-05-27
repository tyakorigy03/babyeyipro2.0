import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getUser } from '../core/auth/index.js';

export function RequireAuth({ children }) {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}
