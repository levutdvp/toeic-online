import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditStudent {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export const editStudent = (params: IEditStudent, id: number) => {
  return apiCall<IEditStudent>(
    {
      url: `${API_URL}/api/students/edit-student/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
