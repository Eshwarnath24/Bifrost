import { Navigate } from 'react-router-dom';
import { loadAuthSession } from '../lib/authStorage';

const ProtectedRoute = ({ children }) => {
  if (!loadAuthSession()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;