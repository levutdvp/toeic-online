import { NEVER, throwError } from "rxjs";
import { ajax, AjaxConfig, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import jstz from "jstz";
import { showToast } from "../toast";
import { getAccessToken, isLogged } from "../auth";
export type CustomErrorOption = "throwOnly" | "notifyOnly" | "throwAndNotify";

export interface Response<Data> {
  type?: "ok" | "info" | "warn" | "error";
  message?: string;
  code: "0" | string;
  data: Data;
  meta?: {
    total: number;
    pageSize: number;
    pageCurrent: number;
    totalPage: number;
  };
}

export interface HTTPOptions {
  customError: CustomErrorOption;
  isUploadFile?: boolean;
  contentType?: string;
  responseType?: XMLHttpRequestResponseType;
}

export const apiCall = <DataShape>(
  ajaxConfig: AjaxConfig,
  options: HTTPOptions = {} as HTTPOptions
) => {
  const timezone = jstz.determine();

  ajaxConfig.responseType = options.responseType || "json";
  ajaxConfig.headers = {
    ...(!options.isUploadFile && {
      ["Content-Type"]: options.contentType || "application/json",
    }),
    ...ajaxConfig.headers,
    ...(isLogged() && { Authorization: `Bearer ${getAccessToken()}` }),
    "X-TZ-Offset": timezone.name(),
  } as any;

  return ajax(ajaxConfig).pipe(
    catchError(handleError(options)),
    map<AjaxResponse<any>, DataShape extends Blob ? Blob : Response<DataShape>>(
      (res) => res.response
    )
  );
};

const handleError = (options: HTTPOptions) => (error: AjaxResponse<any>) => {
  const { response } = error;

  if (error.status === 403) {
    // TODO

    return NEVER;
  }

  if (options.customError === "throwOnly") {
    return throwError(() => response);
  }

  if (options.customError === "throwAndNotify") {
    displayError(response);

    return throwError(() => response);
  }

  displayError(response);

  return NEVER;
};

const displayError = (response: any) => {
  if (!response) {
    showToast({
      type: "error",
      content: "Error network",
    });

    return;
  }

  showToast({
    type: "error",
    content: response.message || "Error unexpected",
  });
};
