import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IGetListTest {
  id?: number;
  exam_code: string;
  exam_name: string;
  duration: number;
  part_number: string;
  section_name: string;
  question_count: number;
  max_score: number;
  type: string;
  is_Free?: boolean;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getListExam = (params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListTest[]>(
    {
      url: `${API_URL}/api/exam-sections/all?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
