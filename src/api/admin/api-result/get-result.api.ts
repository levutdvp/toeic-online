import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IStudentResult {
  user_id: number;
  user_name: string;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  submitted_at: string;
}

export interface IExamResult {
  exam_code: string;
  part_number: string;
  students: IStudentResult[];
}

export const getExamResult = () => {
  return apiCall<IExamResult[]>(
    {
      url: `${API_URL}/api/exam-results/statistics`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
