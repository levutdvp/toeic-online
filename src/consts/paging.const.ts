export type TInitPaging = {
  pageCurrent: number;
  pageSize: number;
  total: number;
  totalPage: number;
};

export const initPaging: Readonly<TInitPaging> = {
  pageCurrent: 1,
  pageSize: 10,
  total: 0,
  totalPage: 1,
};
