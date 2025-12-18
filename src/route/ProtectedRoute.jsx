import { Navigate, Outlet } from 'react-router-dom';
import AuthStore from '../store/AuthStore';
const ProtectedRoute = () => {
  const access = AuthStore((state) => state.access);

  return access ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
