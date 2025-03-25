import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IQuestion {
  question_number: number;
  part_number: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  audio_url: string;
  image_url: string;
}

export interface IQuestionGroup {
  questions: IQuestion;
}

export interface IExcelExamResponse {
  part_number: string;
  groups: IQuestionGroup[];
}

export const getExcelExam = (file: File | Blob, partNumber: number) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiCall<IExcelExamResponse>(
    {
      url: `${API_URL}/api/read-excel/${partNumber}`,
      method: "POST",
      body: formData,
    },
    {
      customError: "throwAndNotify",
      isUploadFile: true,
    }
  );
};
