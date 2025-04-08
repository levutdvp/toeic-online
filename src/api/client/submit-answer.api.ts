import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAnswer {
  question_number: number;
  user_answer: string;
  correct_answer: string;
}

export interface IPart {
  part_number: number;
  answers: IAnswer[];
}

export interface ISubmitTest {
  user_id?: number;
  exam_code: string;
  parts: IPart[];
}

export interface ISubmitTestResponse {
  part_number: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
}

export const submitTest = (params: ISubmitTest) => {
  return apiCall<ISubmitTestResponse[]>(
    {
      url: `${API_URL}/api/submit-exam`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
