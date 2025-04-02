import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAddStudentToClass {
  user_id: string;
  class_id: string;
}

export const addStudentToClass = (params: IAddStudentToClass) => {
  return apiCall(
    {
      url: `${API_URL}/api/classes/students`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
