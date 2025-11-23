import { Navigate, Outlet } from "react-router-dom";
import getUserRoleFromToken from "../utils/auth";

const RoleProtectionRoute = ({ allowedRoles }) => {
  const userRole = getUserRoleFromToken();

   if (!userRole) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default RoleProtectionRoute;
