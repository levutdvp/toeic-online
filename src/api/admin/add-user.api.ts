import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAddUser {
  fullName: string;
  email: string;
}

export const addUser = (params: IAddUser) => {
  return apiCall<IAddUser>(
    {
      url: `${API_URL}/api/users/add-user`,
      method: 'POST',
      body: params,
    },
    {
      customError: 'throwAndNotify',
    },
  );
};
