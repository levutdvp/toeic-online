import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { UserRole } from "@/types/permission.type";
import queryString from "query-string";

export interface IGetListUsers {
  id?: number;
  username: string;
  email: string;
  role: UserRole[];
  active_status: boolean;
  active_date: boolean;
  is_first?: boolean;
}

export interface IParams {
  pageNumber: number;
  pageSize: number;
}

export const getUsersList = (params: IParams) => {
  const querystring = queryString.stringify(params);

  return apiCall<IGetListUsers[]>(
    {
      url: `${API_URL}/api/users/list?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
