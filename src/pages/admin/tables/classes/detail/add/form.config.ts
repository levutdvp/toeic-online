import { TFormRules } from "@/types/form.type";

export interface IAddForm {
  id_class?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
}

export const validateForm: TFormRules<IAddForm> = {
  name: [{ required: true, message: "Vui lòng nhập đầy đủ họ tên" }],
  dob: [{ required: true, message: "vui lòng chọn ngày sinh" }],
  gender: [{ required: true, message: "Vui lòng chọn giới tính" }],
  phone: [{ required: true, message: "Vui lòng nhập số điện thoại" }],
  address: [{ required: true, message: "Vui lòng nhập nơi ở hiện tại" }],
};
