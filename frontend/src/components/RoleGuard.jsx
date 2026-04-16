import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ roles = [], children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
