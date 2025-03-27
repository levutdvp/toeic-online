import { clearAccessToken } from "@/services/auth";
import { Menu, MenuItem, MenuButton } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const HeaderNav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAccessToken();
    navigate("/auth/login");
  };
  return (
    <>
      <Menu
        menuAlign="end"
        trigger={
          <MenuButton variation="menu">
            <div className="header-avatar">
              <img alt="avatar" src={"https://i.pravatar.cc/150?img=3"}></img>
            </div>
          </MenuButton>
        }
      >
        <MenuItem onClick={() => navigate("/admin/profile")}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default HeaderNav;
