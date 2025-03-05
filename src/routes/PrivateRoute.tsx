import { useAuth } from "@/hooks/use-auth.hook";
import PageNotFound from "@/pages/normal/page-not-found";
import { isLogged } from "@/services/auth";
import { UserRole } from "@/types/permission.type";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
  requiredRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  requiredRoles,
}) => {
  if (!isLogged()) {
    return <Navigate to="/auth/login" replace />;
  }
  const { userRoles } = useAuth();
  const hasAccess = requiredRoles?.some((roles) => userRoles?.includes(roles));
  if (!hasAccess && userRoles.length > 0) {
    return <PageNotFound />;
  }
  if (userRoles.includes("ADMIN") || userRoles.includes("TEACHER")) {
    return element;
  }

  return "";
};

export default PrivateRoute;
