import { Button, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CiLock } from "react-icons/ci";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ILoginReq, loginApi } from "@/api/auth/login.api";
import { useSubscription } from "@/hooks/use-subscription.hook";
import { removeLoading } from "@/services/loading";
import { authReducer } from "@/contexts/auth.context";
import { useEffect, useReducer } from "react";
import { saveAccessToken } from "@/services/auth";
import { useForm } from "antd/es/form/Form";
const LoginPage = () => {
  const navigate = useNavigate();
  const subscription = useSubscription();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
  });
  const [form] = useForm();

  console.log(form.getFieldValue(["username"]));
  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  useEffect(() => {
    subscription.unsubscribe();
  }, []);

  const onFinish = (values: ILoginReq) => {
    const loginSub = loginApi(values).subscribe({
      next: (res) => {
        removeLoading();
        dispatch({ type: "LOGIN", payload: { username: values.username } });
        saveAccessToken({
          accessToken: res.data["token"],
          expiredTime: res.data["expires_in"]
            ? Number(res.data["expires_in"]) / 60 / 60 / 24
            : 9999,
        });
      },

      error: () => {
        removeLoading();
      },
    });

    subscription.add(loginSub);
  };

  const onFinishFailed = () => {};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[600px]">
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed} form={form}>
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
            {/* <button onClick={handleLoginClick} type="button">
              Đăng nhập
            </button> */}
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
