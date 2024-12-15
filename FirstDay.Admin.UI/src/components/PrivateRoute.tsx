import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - current location:", location);

  if (!isAuthenticated) {
    console.log("PrivateRoute - redirecting to login");
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute - rendering protected content");
  return <Outlet />;
}