import { TFormRules } from "@/types/form.type";
import { UserRole } from "@/types/permission.type";

export interface IEditForm {
  username: string;
  email: string;
  role: UserRole[];
}

export const validateForm: TFormRules<IEditForm> = {
  username: [{ required: true, message: "Vui lòng nhập tên người dùng" }],
  email: [
    { required: true, message: "Vui lòng nhập email" },
    { type: "email", message: "vui lòng nhập đúng định dạng email" },
  ],
  role: [{ required: true, message: "Vui lòng chọn quyền" }],
};
