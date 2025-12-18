import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return !isAuth ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
