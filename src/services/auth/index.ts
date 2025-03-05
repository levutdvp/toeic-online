import { ACCESS_TOKEN } from "@/consts/common.const";
import Cookies from "js-cookie";

interface UserCredential {
  accessToken: string;
}

export const isLogged = () => {
  return !!Cookies.get(ACCESS_TOKEN);
};

export const saveAccessToken = (userCredential: UserCredential) => {
  console.log(userCredential);
  Cookies.set(ACCESS_TOKEN, userCredential.accessToken);
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN);
};
