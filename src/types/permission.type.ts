export enum UserRoleEnum {
  ADMIN = "Admin",
  STUDENT = "Student",
  TEACHER = "Teacher",
}

export type UserRole = `${UserRoleEnum}`;
