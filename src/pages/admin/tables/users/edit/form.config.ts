import { TFormRules } from "@/types/form.type";
import { UserRole } from "@/types/permission.type";

export interface IEditForm {
  username: string;
  email: string;
  role: UserRole[];
}

export const validateForm: TFormRules<IEditForm> = {
  username: [{ required: true, message: "Please input user name" }],
  email: [
    { required: true, message: "Please input email address" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  role: [{ required: true, message: "Please select role" }],
};
