import { TFormRules } from "@/types/form.type";
export interface IAddForm {
  user_id: string;
  certificate_name: string;
  score: number;
}

export const validateForm: TFormRules<IAddForm> = {
  certificate_name: [{ required: true, message: "Vui lòng nhập tên bằng cấp" }],
  score: [{ required: true, message: "vui lòng nhập điểm" }],
};
