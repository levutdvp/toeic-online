import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { map } from "rxjs";

export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  username: string;
  id: number;
  token: string;
  expired: number;
}

export const loginApi = (params: ILoginReq) => {
  return apiCall<ILoginRes>(
    {
      url: `${API_URL}/api/auth/login`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  ).pipe(
    map((response) => {
      const { data } = response;

      return {
        ...response,
        data: {
          ...data,
        },
      };
    })
  );
};
