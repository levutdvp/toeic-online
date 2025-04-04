import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { UserRole } from "@/types/permission.type";

export interface IAddUser {
  username: string;
  email: string;
  role: UserRole[];
}

export const addUser = (params: IAddUser) => {
  return apiCall<IAddUser>(
    {
      url: `${API_URL}/api/users/add-user`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
