import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditTeacher {
  id?: number;
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  certificates?: string[];
}

export const editTeacherOwn = (params: IEditTeacher, id: number) => {
  return apiCall<IEditTeacher>(
    {
      url: `${API_URL}/api/teachers/edit-teacher-own/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
