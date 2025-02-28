import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import "./Layout.css";
import { baseConfig } from "../config";
import Header from "../Header";
import SideBar from "../SideBar";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = () => {
  return (
    <div className="layout-container">
      {baseConfig.header ? <Header /> : <></>}
      <SideBar />

      <div className="page-container">
        <Outlet />
      </div>
      {baseConfig.footer ? <Footer /> : <></>}
    </div>
  );
};

export default Layout;
