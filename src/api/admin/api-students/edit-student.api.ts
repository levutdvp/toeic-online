import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditStudent {
  name: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export const editStudent = (params: IEditStudent) => {
  return apiCall<IEditStudent>(
    {
      url: `${API_URL}/api/students/edit-student`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
