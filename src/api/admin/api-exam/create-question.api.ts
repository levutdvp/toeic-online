import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface ICreateQuestionBody {
  audio_url: string;
  image_url: string;
}

export const createQuestion = (
  body: any,
  part_number: number,
  exam_code: string
) => {
  return apiCall(
    {
      url: `${API_URL}/api/create-question/${exam_code}/${part_number}`,
      method: "POST",
      body: JSON.stringify(body),
    },
    {
      customError: "throwAndNotify",
    }
  );
};
