import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListTestFull {
  id?: number;
  title: string;
  duration: number;
  parts: number;
  questions: number;
  maxScore: number;
  label: string;
  isFree?: boolean;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getTestFull = (params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListTestFull[]>(
    {
      url: `${API_URL}/api/tests-full/list?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
