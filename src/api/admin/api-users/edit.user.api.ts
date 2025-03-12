import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { UserRole } from "@/types/permission.type";

export interface IEditUser {
  username: string;
  email: string;
  role: UserRole[];
}

export const editUser = (params: IEditUser) => {
  return apiCall<IEditUser>(
    {
      url: `${API_URL}/api/users/edit-user`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
