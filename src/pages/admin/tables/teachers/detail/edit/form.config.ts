import { TFormRules } from "@/types/form.type";
export interface IEditForm {
  user_id: string;
  certificate_name: string;
  score: string;
}

export const validateForm: TFormRules<IEditForm> = {
  certificate_name: [{ required: true, message: "Vui lòng nhập tên bằng cấp" }],
  score: [{ required: true, message: "vui lòng nhập điểm" }],
};
