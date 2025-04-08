import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListExamHistory {
  id?: number;
  exam_date: string;
  exam_name: string;
  exam_code: string;
  part_number: number;
  exam_type: string;
  status: string;
  score: number;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getExamHistory = (id: number, params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListExamHistory[]>(
    {
      url: `${API_URL}/api/exam-history/${id}?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
