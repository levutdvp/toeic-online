import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IGetListCertificate {
  id?: number;
  certificate_name: string;
  score: string;
  issued_by: string;
  issue_date: string;
  expiry_date: string;
}

export const getCertificateList = (user_id: string) => {
  return apiCall<IGetListCertificate[]>(
    {
      url: `${API_URL}/api/diploma/list/${user_id}`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  );
};
