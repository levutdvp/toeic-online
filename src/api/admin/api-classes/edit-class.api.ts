import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditClass {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string[];
  number_of_students: number;
  teacher: string;
}

export const editClass = (params: IEditClass, id: number) => {
  return apiCall<IEditClass>(
    {
      url: `${API_URL}/api/class/edit-class/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
