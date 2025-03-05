export type TInitPaging = {
  current: number;
  pageSize: number;
  total: number;
  totalPage: number;
};

export const initPaging: Readonly<TInitPaging> = {
  current: 1,
  pageSize: 10,
  total: 0,
  totalPage: 1,
};
