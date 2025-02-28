import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { UserRole, UserRoleEnum } from "@/types/permission.type";
import { map } from "rxjs";

export interface IUserProfile {
  id: number;
  fullName: string;
  username: string;
  email: string;
  roles: UserRole[];
  isAdmin: boolean;
  isClient: boolean;
}

export const getUserProfile = () => {
  return apiCall<IUserProfile>(
    {
      url: `${API_URL}/api/auth`,
      method: "GET",
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
          name: data.username,
          isAdmin: !data.isAdmin,
          isClient:
            !data.isAdmin &&
            (data.roles.includes(UserRoleEnum.STUDENT) ||
              data.roles.includes(UserRoleEnum.TEACHER)),
        },
      };
    })
  );
};
