import { useCallback, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { getAccessToken, isLogged } from "@/services/auth";
import { getUserProfile, IUserProfile } from "@/api/auth/user-profile.api";
import { UserRole } from "@/types/permission.type";

const userRolesSubject = new BehaviorSubject<UserRole[]>([]);
export const userAuthSubject = new BehaviorSubject<IUserProfile | undefined>(
  undefined
);

let isLoading = false;

let userInfo: IUserProfile = {} as IUserProfile;

const getUserInfo = (isUpdate = false) => {
  const userData = userAuthSubject.getValue();
  const needCallApi = !(userData || isLoading);

  if (!needCallApi && !isUpdate) return;

  isLoading = true;

  getUserProfile().subscribe({
    next: (res) => {
      userRolesSubject.next(res.data.roles);
      userAuthSubject.next(res.data);
    },
    error: () => {},
  });
};

export function useAuth() {
  useEffect(() => {
    userAuthSubject.subscribe((data) => {
      if (data === null) return;

      if (data) {
        userInfo = data;
      }
    });
    if (isLogged()) {
      getUserInfo();
    }
  }, []);

  const syncDataWithServer = useCallback((isUpdate = false) => {
    if (isLogged()) {
      getUserInfo(isUpdate);
    }
  }, []);

  if (!isLogged()) userInfo = {} as IUserProfile;

  return {
    isLoggedIn: isLogged(),
    userInfo,
    syncDataWithServer,
    accessToken: getAccessToken(),
  };
}
