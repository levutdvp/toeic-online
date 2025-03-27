import { TFormRules } from "@/types/form.type";

export interface IAddForm {
  exam_code: string;
  exam_name: string;
  duration: number;
  part_number: number;
  section_name: string;
  question_count: number;
  max_score: number;
  type: string;
  is_Free: boolean;
}

export const validateForm: TFormRules<IAddForm> = {
  exam_code: [{ required: true, message: "Vui lòng nhập mã đề thi" }],
  exam_name: [{ required: true, message: "Vui lòng nhập tên đề thi" }],
  duration: [{ required: true, message: "Vui lòng nhập thời gian làm bài" }],
  part_number: [{ required: true, message: "Vui lòng chọn phần thi" }],
  section_name: [{ required: true, message: "Vui lòng nhập tên phần thi" }],
  question_count: [{ required: true, message: "Vui lòng nhập số câu hỏi" }],
  max_score: [
    { required: true, message: "Vui lòng nhập số điểm tối đa có thể đạt được" },
  ],
  type: [{ required: true, message: "Vui lòng nhập loại đề thi" }],
};
