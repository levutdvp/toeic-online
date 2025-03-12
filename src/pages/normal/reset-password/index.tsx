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

  const onFinish = ({ email, password }: IResetPasswordForm) => {
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
      password,
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
    <div>
      <div>
        <Form
          name="login-form"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            email: queryStringParams.email,
            username: queryStringParams.username,
          }}
        >
          <p>Thay đổi mật khẩu</p>
          {!!queryStringParams.username && (
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={formRules().password}
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

          <div>
            <Button type="primary" htmlType="submit" onClick={form.submit}>
              Cập nhật
            </Button>
            <Button
              type="default"
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              Hủy bỏ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
