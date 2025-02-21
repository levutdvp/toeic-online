import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { CiLock } from "react-icons/ci";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const handleSignup = () => {
    navigate("/auth/sign-up");
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[600px]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mt-2">Đăng nhập tài khoản</h2>
        </div>

        {/* <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg shadow-sm hover:bg-gray-100">
          <img src="/google-icon.png" alt="Google" className="h-5" />
          Đăng nhập bằng Google
        </button> */}

        <p className="text-gray-500 my-4 text-[14px] font-[500] mb-4">
          Nhập thông tin đăng nhập của bạn để có quyền truy cập!
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Tên tài khoản hoặc Email
          </label>
          <Input
            size="large"
            placeholder="Nhập tên tài khoản hoặc Email"
            prefix={<UserOutlined />}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Mật khẩu
          </label>
          <Input.Password
            size="large"
            placeholder="Nhập mật khẩu"
            prefix={<CiLock />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>

        <div className="flex justify-between text-sm text-blue-500 mb-4">
          <div className="flex">
            <p className="mr-2 text-gray-400">Bạn chưa có tài khoản?</p>
            <a onClick={handleSignup} className="hover:underline">
              Đăng ký
            </a>
          </div>
          <a href="#" className="hover:underline">
            Quên mật khẩu?
          </a>
        </div>
        <div className="flex justify-center">
          <Button type="default" size="large" color="default" variant="solid">
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
