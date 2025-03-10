import { useAuth } from "@/hooks/use-auth.hook";
import { clearAccessToken } from "@/services/auth";
import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { baseConfig } from "../admin/config";
import { default as HeaderAdmin } from "../admin/Header";
import { default as HeaderClient } from "../client/Header";
import SideBar from "../admin/SideBar";
import { default as FooterClient } from "../client/Footer";
import { default as FooterAdmin } from "../admin/Footer";
import "./Layout.css";

export interface DefaultLayoutProps {
  children?: React.ReactNode;
  isDefaultLayout?: boolean;
  isAdmin?: boolean;
}

const DefaultLayout = ({
  children,
  isDefaultLayout = true,
}: DefaultLayoutProps) => {
  const { accessToken, userRoles } = useAuth();

  if (!accessToken) {
    clearAccessToken();
    return <Navigate to={"/auth/login"} />;
  }

  const isAdmin = useMemo(() => {
    return userRoles.some((role) => ["ADMIN", "TEACHER"].includes(role));
  }, [userRoles]);

  const HeaderElement = isAdmin ? HeaderAdmin : HeaderClient;
  const FooterElement = isAdmin ? FooterAdmin : FooterClient;

  const pathName = window.location.pathname;

  return (
    <div className="layout-container">
      {baseConfig.header && isDefaultLayout ? <HeaderElement /> : <></>}
      {isAdmin && pathName !== "/" && <SideBar />}

      <div className="page-container">{children ? children : <Outlet />}</div>
      {baseConfig.footer && isDefaultLayout ? <FooterElement /> : <></>}
    </div>
  );
};

export default DefaultLayout;
