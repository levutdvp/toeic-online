export enum UserRoleEnum {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export type UserRole = `${UserRoleEnum}`;

export interface TableQueriesRef extends Pick<Pagination, 'current' | 'pageSize' | 'total'> {
  current: number;
  pageSize: number;
  totalPage?: number;
}
