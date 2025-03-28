import { TFormRules } from "@/types/form.type";

export interface IResetPasswordForm {
  email: string;
  new_password: string;
  confirmPassword: string;
}

export const formRules = (): TFormRules<IResetPasswordForm> => {
  return {
    new_password: [
      {
        required: true,
        message: "Vui lòng nhập mật khẩu của bạn",
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: "Vui lòng nhập lại mật khẩu",
      },
      (formInstance) => ({
        message: "Mật khẩu nhập lại không đúng",
        validator(rule, value) {
          if (!value || !rule) {
            return Promise.resolve();
          }
          const password = formInstance.getFieldValue("new_password");
          if (value !== password) {
            return Promise.reject(new Error());
          }

          return Promise.resolve();
        },
      }),
    ],
  };
};
