import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAddStudent {
  name: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
}

export const addStudent = (params: IAddStudent) => {
  return apiCall<IAddStudent>(
    {
      url: `${API_URL}/api/students/add-student`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
