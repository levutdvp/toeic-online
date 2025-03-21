import { Dropdown, Space } from "antd";
import {
  ContactsOutlined,
  DownOutlined,
  IdcardOutlined,
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
        <div>
          <IdcardOutlined className="mr-2" />
          Lớp học của tôi
        </div>
      ),
    },
    {
      key: "3",
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
          <a href="#" className="text-gray-700 no-underline">
            Luyện tập Reading
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Nghe - Chép chính tả
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Khóa học
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Lịch khai giảng
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Liên hệ
          </a>
          <a href="#" className="text-gray-700 no-underline">
            Góp ý
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
