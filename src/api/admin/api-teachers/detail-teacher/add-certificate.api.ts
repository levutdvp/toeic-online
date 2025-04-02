import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IAddCertificate {
  user_id: string;
  certificate_name: string;
  score: number;
  issued_by: string;
  issue_date: string;
  expiry_date: string;
}

export const addCertificate = (params: IAddCertificate) => {
  return apiCall<IAddCertificate>(
    {
      url: `${API_URL}/api/diploma/add-diploma-teacher`,
      method: "POST",
      body: params,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
