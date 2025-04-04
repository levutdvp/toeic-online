import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListTestFull {
  id?: number;
  exam_code: string;
  exam_name: string;
  duration: number;
  part_number: string;
  section_name: string;
  question_count: number;
  max_score: number;
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
