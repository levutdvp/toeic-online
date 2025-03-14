import { Button, Form, Input } from "antd";
import { formRules, IResetPasswordForm } from "./form.config";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "@/services/toast";
import { removeLoading, showLoading } from "@/services/loading";
import { resetPassword } from "@/api/auth/reset-password.api";

const ResetPassword = () => {
  const [form] = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryStringParams = {
    email: searchParams.get("email") ?? "",
    username: searchParams.get("username") ?? "",
    token: searchParams.get("token") ?? "",
  };

  const onFinish = ({ email, new_password }: IResetPasswordForm) => {
    if (!email) {
      showToast({
        type: "error",
        content: "Email not found",
      });

      return;
    }

    showLoading();
    const resetPwSub = resetPassword({
      email,
      new_password,
      token: queryStringParams.token,
    }).subscribe({
      next: () => {
        removeLoading();
        navigate("/auth/login");
        showToast({ content: "Change password success" });
      },
      error: () => {
        removeLoading();
      },
    });

    resetPwSub.add();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-lg font-semibold mb-4">
          Thay đổi mật khẩu
        </h2>
        <Form
          name="login-form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            email: queryStringParams.email,
            username: queryStringParams.username,
          }}
        >
          {!!queryStringParams.username && (
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled className="bg-gray-100" />
            </Form.Item>
          )}

          <Form.Item label="Email" name="email">
            <Input disabled className="bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={formRules().new_password}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirm-password"
            rules={formRules().confirmPassword}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <div className="flex justify-center mt-4">
            <Button type="default" onClick={() => navigate("/auth/login")}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={form.submit}
              style={{ marginLeft: "20px" }}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
