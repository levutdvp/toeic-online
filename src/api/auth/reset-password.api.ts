import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IPrams {
  token: string;
  email: string;
  password: string;
}

export const resetPassword = (params: IPrams) => {
  return apiCall<string>(
    {
      url: `${API_URL}/api/reset-password`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
