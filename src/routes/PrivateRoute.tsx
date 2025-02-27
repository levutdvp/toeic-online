import { isLogged } from "@/services/auth";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  return !isLogged() ? <Navigate to="/auth/login" replace /> : element;
};

export default PrivateRoute;
