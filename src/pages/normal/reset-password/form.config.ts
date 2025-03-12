import { TFormRules } from "@/types/form.type";

export interface IResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export const formRules = (): TFormRules<IResetPasswordForm> => {
  return {
    password: [
      {
        required: true,
        message: "Please enter your password",
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: "Please re-enter your password",
      },
      (formInstance) => ({
        message: "Re-password does not match",
        validator(rule, value) {
          if (!value || !rule) {
            return Promise.resolve();
          }

          const password = formInstance.getFieldValue("password");

          if (value !== password) {
            return Promise.reject(new Error());
          }

          return Promise.resolve();
        },
      }),
    ],
  };
};
