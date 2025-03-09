import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export const deleteUser = (ids: Array<number>) => {
  return apiCall(
    {
      url: `${API_URL}/api/users/delete`,
      method: "DELETE",
      body: {ids},
    },
    {
      customError: "throwAndNotify",
    }
  );
};
