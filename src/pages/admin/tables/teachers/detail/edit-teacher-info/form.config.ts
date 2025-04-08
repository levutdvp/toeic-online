import { TFormRules } from "@/types/form.type";

export interface IEditTeacherInfoForm {
  name: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  email: string;
}

export const validateForm: TFormRules<IEditTeacherInfoForm> = {
  name: [{ required: true, message: "Vui lòng nhập đầy đủ họ và tên" }],
  gender: [{ required: true, message: "Vui lòng chọn giới tính" }],
  dob: [{ required: true, message: "Vui lòng nhập ngày sinh" }],
  phone: [{ required: true, message: "Vui lòng nhập số điện thoại" }],
  address: [{ required: true, message: "Vui lòng nhập địa chỉ" }],
  email: [
    { required: true, message: "Vui lòng nhập email" },
    { type: "email", message: "Email không hợp lệ" },
  ],
};
