import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminGuard() {
  const { user, loading } = useAuth();
  
  if (loading) return null; // let AuthGuard handle Splash
  if (!user || user.email !== 'dev728132@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
