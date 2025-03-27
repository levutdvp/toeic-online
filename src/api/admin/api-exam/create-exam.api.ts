import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface ICreateExam {
  exam_code: string;
  exam_name: string;
  section_name: string;
  part_number: number;
  question_count: number;
  year: string;
  duration: number;
  max_score: number;
  type: string;
  is_Free: boolean;
}

export const addExam = (params: ICreateExam) => {
  return apiCall(
    {
      url: `${API_URL}/api/create-exam-section`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
