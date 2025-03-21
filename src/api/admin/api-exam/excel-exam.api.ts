import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IExcelExam {
  id?: number;
  question_number: string;
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  explanation: string;
  audio: string;
  image: string;
}

export const getExcelExam = (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiCall<IExcelExam[]>(
    {
      url: `${API_URL}/api/read-excel`,
      method: "POST",
      body: formData,
    },
    {
      customError: "throwAndNotify",
      isUploadFile: true,
    }
  );
};
