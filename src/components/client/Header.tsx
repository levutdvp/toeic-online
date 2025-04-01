import { Dropdown, Modal, Space } from "antd";
import {
  ContactsOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { clearAccessToken } from "@/services/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.hook";
import { useState } from "react";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const pathname = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const handleLogout = () => {
    clearAccessToken();
    navigate("/auth/login");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const items = [
    {
      key: "1",
      label: (
        <div onClick={showModal}>
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
  console.log("pathname", pathname);
  return (
    <header className="bg-white shadow p-4">
      <div className="no-underline flex justify-between ">
        <div className="text-lg font-bold flex items-center">
          Lớp TOEIC Thầy Long
        </div>
        <div className="flex space-x-14 items-center">
          <Link
            to="/"
            className={`font-bold text-gray-700 no-underline hover:text-blue-500 ${
              pathname.pathname === "/" ? "!text-blue-500 " : ""
            }`}
          >
            Thi thử Full Test
          </Link>
          <Link
            to="/practice"
            className={`font-bold text-gray-700 no-underline hover:text-blue-500 ${
              pathname.pathname.includes("/practice") ? "!text-blue-500" : ""
            }`}
          >
            Luyện tập Part
          </Link>
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
      <Modal
        title="Thông tin tài khoản"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <p>
          <strong>Tên người dùng:</strong> {userInfo?.username}
        </p>
        <p>
          <strong>Tên đầy đủ:</strong> {userInfo?.fullName}
        </p>
        <p>
          <strong>Email:</strong> {userInfo?.email}
        </p>
      </Modal>
    </header>
  );
};

export default Header;
