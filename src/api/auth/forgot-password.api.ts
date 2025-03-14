import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import queryString from "query-string";

export interface IPrams {
  email: string;
}

export const forgotPassword = (params: IPrams) => {
  const querystring = queryString.stringify(params);
  return apiCall<string>(
    {
      url: `${API_URL}/api/auth/forgot-password?${querystring}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
