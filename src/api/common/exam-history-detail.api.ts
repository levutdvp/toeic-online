import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IExamHistoryDetailRequest {
  exam_date: string;
  user_id: number;
  exam_code: string;
  part_number: number;
}

export interface IExamHistoryDetailResponse {
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  user_answer: string | null;
  is_correct: boolean | null;
  image_url: string;
  audio_url: string;
  explanation: string;
}

export interface IExamHistoryDetailResponseData {
  [key: string]: IExamHistoryDetailResponse[];
}

export const getExamHistoryDetail = (params: IExamHistoryDetailRequest) => {
  return apiCall<IExamHistoryDetailResponseData>(
    {
      url: `${API_URL}/api/exam-history-detail`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
