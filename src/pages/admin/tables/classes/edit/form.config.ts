import { TFormRules } from "@/types/form.type";

export interface IEditForm {
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string[];
  number_of_students: number;
  teacher: string;
}

export const validateForm: TFormRules<IEditForm> = {
  class_code: [{ required: true, message: "Vui lòng nhập tên lớp" }],
  class_type: [{ required: true, message: "Vui lòng nhập mã lớp" }],
  start_date: [{ required: true, message: "Vui lòng nhập ngày bắt đầu" }],
  end_date: [{ required: true, message: "Vui lòng nhập ngày kết thúc" }],
  start_time: [{ required: true, message: "Vui lòng nhập thời gian bắt đầu" }],
  end_time: [{ required: true, message: "Vui lòng nhập thời gian kết thúc" }],
  days: [{ required: true, message: "Vui lòng chọn ngày học" }],
  number_of_students: [
    { required: true, message: "Vui lòng nhập số lượng học viên" },
  ],
  teacher: [
    { required: true, message: "Vui lòng nhập tên giáo viên phụ trách" },
  ],
};
