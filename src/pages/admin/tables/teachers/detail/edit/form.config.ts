import { TFormRules } from "@/types/form.type";
export interface IEditForm {
  id: string;
  certificate_name: string;
  score: string;
  issued_by: string;
  issue_date: string;
  expiry_date: string;
}

export const validateForm: TFormRules<IEditForm> = {
  certificate_name: [{ required: true, message: "Vui lòng nhập tên chứng chỉ" }],
  score: [{ required: true, message: "vui lòng nhập điểm" }],
  issued_by: [
    { required: true, message: "vui lòng nhập tên tổ chức cấp bằng" },
  ],
  issue_date: [{ required: true, message: "vui lòng nhập ngày cấp bằng" }],
  expiry_date: [{ required: true, message: "vui lòng nhập ngày hết hạn" }],
};
