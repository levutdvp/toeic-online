import { isLogged } from "@/services/auth";
import { UserRole } from "@/types/permission.type";
// import { userPermission } from "@/utils/permission.util";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
  requiredRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  // requiredRoles,
}) => {
  if (!isLogged()) {
    return <Navigate to="/auth/login" replace />;
  }

  // const userRoles = userPermission.getUserRoles();
  // const hasAccess = requiredRoles.some((role) => userRoles.includes(role));
  // if (!hasAccess) {
  //   return <Navigate to="/unauthorized" replace />;
  // }
  return element;
};

export default PrivateRoute;
