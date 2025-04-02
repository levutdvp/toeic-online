import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { UserRole } from "@/types/permission.type";
import { map } from "rxjs";

export interface IUserProfile {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: UserRole[];
  isAdmin: boolean;
  isClient: boolean;
  phone: string;
  dob: string;
  address: string;
  gender: string;
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

      const roles = Array.isArray(data.role) ? data.role : [data.role];

      return {
        ...response,
        data: {
          ...data,
          role: roles,
        },
      };
    })
  );
};
