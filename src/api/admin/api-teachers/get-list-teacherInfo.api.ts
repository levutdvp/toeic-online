import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";
export interface ICertificate {
  id?: number;
  certificate_name: string;
  score: string;
}
export interface IGetListTeachers {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  certificate: ICertificate[];
  avatar?: string;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getTeachersList = (params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListTeachers[]>(
    {
      url: `${API_URL}/api/teachers/list?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
