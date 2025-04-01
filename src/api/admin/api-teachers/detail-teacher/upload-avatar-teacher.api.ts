import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";

export interface IUploadAvatar {
  id: number;
  image_link?: string;
}

export const uploadAvatarRoleTeacher = (params: IUploadAvatar) => {
  const { id, ...rest } = params;

  return apiCall<IUploadAvatar>(
    {
      url: `${API_URL}/api/teachers/edit-teacher-image/${id}`,
      method: "PUT",
      body: rest,
    },
    {
      customError: "throwAndNotify",
    }
  );
};
