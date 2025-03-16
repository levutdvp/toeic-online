import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditTeacher {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  certificates: string[];
}

export const editTeacher = (params: IEditTeacher, id: number) => {
  return apiCall<IEditTeacher>(
    {
      url: `${API_URL}/api/teachers/edit-teacher/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
