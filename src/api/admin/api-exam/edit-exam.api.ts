import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditExam {
  exam_code: string;
  exam_name: string;
  section_name: string;
  part_number: number;
  question_count: number;
  duration: number;
  max_score: number;
  type: string;
  is_Free: boolean;
}

export const editExam = (params: IEditExam, id: number) => {
  return apiCall(
    {
      url: `${API_URL}/api/edit-exam/${id}`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
