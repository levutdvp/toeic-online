// import { API_URL } from 'consts/common.const';
import { map } from "rxjs";
import { apiCall } from "../../services/api-call";

export interface ILoginReq {
  username: string;
  email?: string;
  password: string;
}

export interface ILoginRes {
  username: string;
  email?: string;
  id: number;
}

export const login = (params: ILoginReq) => {
  return apiCall<ILoginRes>(
    {
      url: `localhost/api/auth/signin`,
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
