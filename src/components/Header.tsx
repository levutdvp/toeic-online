import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FaUser } from "react-icons/fa";
const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

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
        <div>
          {" "}
          <Button
            type="text"
            color="default"
            variant="solid"
            onClick={handleLoginClick}
            size="large"
            shape="round"
            icon={<FaUser />}
            className="cursor-pointer text-center flex"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
