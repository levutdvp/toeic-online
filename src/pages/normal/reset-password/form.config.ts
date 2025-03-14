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

          const password = formInstance.getFieldValue("new_password");
          console.log(value, password);

          if (value !== password) {
            return Promise.reject(new Error());
          }

          return Promise.resolve();
        },
      }),
    ],
  };
};
