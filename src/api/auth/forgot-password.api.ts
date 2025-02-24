import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IPrams {
  email: string;
}

export const forgotPassword = (params: IPrams) => {
  return apiCall<string>(
    {
      url: `${API_URL}/api/auth/forgot-password`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
