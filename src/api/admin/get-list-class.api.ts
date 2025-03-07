import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListClasses {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getClassesList = (params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListClasses[]>(
    {
      url: `${API_URL}/api/classes/list?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
