import { useCallback, useEffect, useState } from "react";
import { getAccessToken, isLogged } from "@/services/auth";
import { getUserProfile, IUserProfile } from "@/api/auth/user-profile.api";
import { UserRole } from "@/types/permission.type";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<IUserProfile | undefined>(undefined);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if (isLogged()) {
      getUserProfile().subscribe({
        next: (response) => {
          const { data } = response;
          setUserInfo(data);
          setUserRoles(data.role || []);
        },
        error: (err) => {
          console.error("Error fetching user info:", err);
        },
      });
    }
  }, []);

  const syncDataWithServer = useCallback(() => {
    if (isLogged()) {
      getUserProfile().subscribe({
        next: (response) => {
          const { data } = response;
          setUserInfo(data);
          setUserRoles(data.role || []);
        },
        error: (err) => {
          console.error("Error fetching user info:", err);
        },
      });
    }
  }, []);

  return {
    isLoggedIn: isLogged(),
    userInfo,
    syncDataWithServer,
    accessToken: getAccessToken(),
    userRoles,
  };
}
