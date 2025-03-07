import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

interface IDeleteProp {
  ids: number[];
}
export const deleteStudent = (params: IDeleteProp) => {
  return apiCall(
    {
      url: `${API_URL}/api/student/delete`,
      method: "DELETE",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
