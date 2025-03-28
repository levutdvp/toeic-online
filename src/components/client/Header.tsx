import { Dropdown, Space } from "antd";
import {
  ContactsOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { clearAccessToken } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.hook";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const handleLogout = () => {
    clearAccessToken();
    navigate("/auth/login");
  };

  console.log(userInfo);
  const items = [
    {
      key: "1",
      label: (
        <div>
          <ContactsOutlined className="mr-2" />
          Thông tin tài khoản
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={handleLogout}>
          <LogoutOutlined className="mr-2" />
          Logout
        </div>
      ),
    },
  ];

  return (
    <header className="bg-white shadow p-4">
      <div className="no-underline flex justify-between ">
        <div className="text-lg font-bold flex items-center">
          Lớp TOEIC Thầy Long
        </div>
        <div className="flex space-x-14 items-center">
          <a href="#" className="text-gray-700 no-underline">
            Trang chủ
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Thi thử Full Test
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Luyện tập Part
          </a>
        </div>
        <div className="flex items-center mr-4">
          <Dropdown menu={{ items }} placement="bottomLeft">
            <a
              style={{ color: "#000000", fontWeight: "bold" }}
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                {userInfo?.username}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
