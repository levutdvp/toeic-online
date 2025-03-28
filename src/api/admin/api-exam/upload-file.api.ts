import { lastValueFrom } from "rxjs";
import { API_URL } from "@/consts/common.const";
import { apiCall, Response } from "@/services/api-call";
import { convertFileToBase64 } from "@/utils/convertFilesToBase64.util";

export interface IUploadFile {
  image_base64?: string;
  audio_base64?: string;
}

export const uploadFile = async ({
  audioFile,
  imageFile,
}: {
  audioFile?: File;
  imageFile?: File;
}) => {
  try {
    const filesImageBase64 = await convertFileToBase64(imageFile);
    const filesAudioBase64 = await convertFileToBase64(audioFile);

    const response = await lastValueFrom(
      apiCall<Response<IUploadFile>>(
        {
          url: `${API_URL}/api/upload-base64`,
          method: "POST",
          body: {
            audio_base64: filesAudioBase64,
            image_base64: filesImageBase64,
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          customError: "throwAndNotify",
        }
      )
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};
