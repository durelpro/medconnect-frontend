import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  
  // Show a basic loading spinner or text while waiting for auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the right role, send to their respective dashboard
    const redirectPath = user.role === 'patient' ? '/dashboard' : '/provider';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};
