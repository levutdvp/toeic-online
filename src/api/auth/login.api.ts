import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { map } from "rxjs";

interface Account {
  id: number;
  username: string;
  email?: string;
}
export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  username: string;
  id: number;
  token: string;
  expires_in: number;
  refresh_token?: string;
  account?: Account[];
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
