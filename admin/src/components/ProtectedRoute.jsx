
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
