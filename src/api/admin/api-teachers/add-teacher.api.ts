import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAddTeacher {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  certificates: string[];
}

export const addTeacher = (params: IAddTeacher) => {
  return apiCall<IAddTeacher>(
    {
      url: `${API_URL}/api/teachers/add-teacher`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
