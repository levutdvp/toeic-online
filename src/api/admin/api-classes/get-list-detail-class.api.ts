import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

interface ITeacherRes {
  id?: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
}
export interface IStudentRes {
  id?: number;
  first_name: string;
  last_name: string;
  full_name: string;
  birth_date: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}
export interface IClassInfo {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string[];
  student_count: number;
  is_full: boolean;
  status: string;
  teacher: ITeacherRes;
}

export interface IGetListDetailClass {
  class_info: IClassInfo;
  students: IStudentRes[];
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getListDetailClass = (id: number, params: IParams) => {
  const querystring = queryString.stringify(params);
  return apiCall<IGetListDetailClass>(
    {
      url: `${API_URL}/api/classes/detail/${id}?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
