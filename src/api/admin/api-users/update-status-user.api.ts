import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditStatusUser {
  id?: number;
  statusUpdateUser: boolean;
}

export const editStatusUser = (params: IEditStatusUser) => {
  return apiCall<IEditStatusUser>(
    {
      url: `${API_URL}/api/users/update-status-user`,
      method: "PATCH",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
