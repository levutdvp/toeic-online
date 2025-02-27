import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button, Form, Input } from "antd";
import { forgotPassword } from "@/api/auth/forgot-password.api";
import { useSubscription } from "@/hooks/use-subscription.hook";
const ForgotPassword = () => {
  const subscription = useSubscription();
  const [isSent, setIsSent] = useState<boolean>(false);
  const [mailName, setMailName] = useState<string>("");

  const onFinish = ({ email }: { email: string }) => {
    setMailName(email);
    const forgotPwSub = forgotPassword({ email }).subscribe({
      next: () => {
        setIsSent(true);
      },
      error: () => {},
    });

    subscription.add(forgotPwSub);
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(https://source.unsplash.com/random/1920x1080)",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg  text-center">
        {isSent ? (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Kiểm tra email</h2>
            <p className="text-gray-600 mb-4">
              Thư quên mật khẩu đã được gửi tới <strong>{mailName}</strong>. Vui
              lòng kiểm tra email để đặt lại mật khẩu.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="flex items-center justify-center text-blue-500 hover:underline"
            >
              <FaArrowLeftLong className="mr-1" />
              Quay lại
            </button>
          </div>
        ) : (
          <Form onFinish={onFinish}>
            <h2 className="text-2xl font-semibold mb-2">Quên mật khẩu</h2>
            <p className="text-gray-600 mb-4">
              Vui lòng nhập username nhận Thư quên mật khẩu.
            </p>

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username" }]}
            >
              <Input placeholder="Username" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  backgroundColor: "#0097b2",
                  color: "#fff",
                }}
                size="large"
                block
                type="primary"
                htmlType="submit"
              >
                Gửi email
              </Button>
            </Form.Item>
            <div className="mt-3">
              <Link
                style={{ color: "#0097b2" }}
                to="/auth/login"
                className="flex items-center justify-center"
              >
                <FaArrowLeftLong className="mr-1" />
                Quay lại
              </Link>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
