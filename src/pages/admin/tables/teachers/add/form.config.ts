import { TFormRules } from "@/types/form.type";
export interface IAddForm {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  certificates: string[];
}

export const validateForm: TFormRules<IAddForm> = {
  name: [{ required: true, message: "Vui lòng nhập đầy đủ họ tên" }],
  dob: [{ required: true, message: "vui lòng chọn ngày sinh" }],
  gender: [{ required: true, message: "Vui lòng chọn giới tính" }],
  phone: [{ required: true, message: "Vui lòng nhập số điện thoại" }],
  email: [
    { required: true, message: "Vui lòng nhập email" },
    { type: "email", message: "vui lòng nhập đúng định dạng email" },
  ],
  address: [{ required: true, message: "Vui lòng nhập nơi ở hiện tại" }],
  certificates: [
    { required: true, message: "Vui lòng nhập ít nhất 1 chứng chỉ" },
  ],
};
