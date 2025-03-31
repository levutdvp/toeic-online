import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditCertificate {
  certificate_name: string;
  score: string;
}

export const editCertificate = (params: IEditCertificate, id: string) => {
  return apiCall<IEditCertificate>(
    {
      url: `${API_URL}/api/diploma/edit-diploma-teacher/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
