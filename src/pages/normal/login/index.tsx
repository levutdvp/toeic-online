import { Button, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CiLock } from "react-icons/ci";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ILoginReq, loginApi } from "@/api/auth/login.api";
import { removeLoading } from "@/services/loading";
import { saveAccessToken } from "@/services/auth";
import { userPermission } from "@/utils/permission.util";
const LoginPage = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const onFinish = (values: ILoginReq) => {
    const loginSub = loginApi(values).subscribe({
      next: (res) => {
        removeLoading();
        saveAccessToken({
          accessToken: res.data["token"],
        });

        const roles = Array.isArray(res.data.role)
          ? res.data.role
          : [res.data.role];
        if (roles.length > 0) {
          if (userPermission.isAdmin(roles)) {
            navigate("/admin");
          } else {
            console.log("aaaaaaaa");
            navigate("/");
          }
        }
      },

      error: () => {
        removeLoading();
      },
    });

    loginSub.add();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[600px]">
        <Form onFinish={onFinish}>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mt-2">Thông tin đăng nhập</h2>
          </div>
          <Form.Item
            name="username"
            className="mb-4"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input
              placeholder="Tên tài khoản hoặc Email"
              size="large"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              size="large"
              prefix={<CiLock />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="flex justify-between text-sm text-blue-500 mb-4">
            <a
              onClick={handleForgotPassword}
              className="hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </a>
          </div>
          <div className="flex justify-center">
            <Button
              style={{
                backgroundColor: "#0097b2",
                color: "#fff",
              }}
              shape="round"
              type="default"
              size="large"
              color="default"
              variant="solid"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
