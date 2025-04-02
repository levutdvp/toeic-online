import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IEditCertificate {
  certificate_name: string;
  score: string;
  issued_by: string;
  issue_date: string;
  expiry_date: string;
}

export const editCertificate = (params: IEditCertificate, id: string) => {
  return apiCall<IEditCertificate>(
    {
      url: `${API_URL}/api/diploma/edit-diploma/${id}`,
      method: "PUT",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
