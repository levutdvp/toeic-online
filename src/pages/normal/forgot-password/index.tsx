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
              Vui lòng nhập địa chỉ email nhận Thư quên mật khẩu.
            </p>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                block
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Gửi email
              </Button>
            </Form.Item>
            <div className="mt-3">
              <Link
                to="/auth/login"
                className="flex items-center justify-center text-blue-500 hover:underline"
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
