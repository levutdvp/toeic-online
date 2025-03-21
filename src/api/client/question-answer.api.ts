import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface ISubmitTest {
  id?: number;
  questionNumber: number;
}

export const submitTest = () => {
  return apiCall<ISubmitTest[]>(
    {
      url: `${API_URL}/api/tests/submit`,
      method: "POST",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
