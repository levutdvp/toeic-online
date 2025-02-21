import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../../consts/common.const";

interface UserCredential {
  accessToken: string;
  expiredTime: number; // day
}

export const isLogged = () => {
  return !!Cookies.get(ACCESS_TOKEN);
};

export const saveAccessToken = (userCredential: UserCredential) => {
  Cookies.set(ACCESS_TOKEN, userCredential.accessToken, {
    expires: userCredential.expiredTime,
  });
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN);
};
