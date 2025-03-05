import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface ICreateClass {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
}

export const addDividend = (params: ICreateClass) => {
  return apiCall(
    {
      url: `${API_URL}/api/create-class`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
