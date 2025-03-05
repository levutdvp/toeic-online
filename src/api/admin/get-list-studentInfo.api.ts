import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListStudents {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getStudentsList = () => {
  // const querystring = queryString.stringify(params);

  return apiCall<IGetListStudents[]>(
    {
      url: `${API_URL}/api/students/list?`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
