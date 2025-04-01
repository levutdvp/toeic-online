import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SideBar.css";
import SideBarNav from "./SidebarNav";
import SidebarNavToggle from "./SidebarNavToggle";
import { useAppNavs } from "../config";

const SideBar = () => {
  const [expand, setExpand] = useState(false);

  const appNavs = useAppNavs();

  const location = useLocation();

  useEffect(() => {
    setExpand(false);
  }, [location]);

  return (
    <>
      <div className="btn-sidebar-nav">
        <SidebarNavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </div>
      <div className={"sidebar " + (expand ? "visible" : "")}>
        <SideBarNav navs={appNavs} />
      </div>
    </>
  );
};

export default SideBar;
