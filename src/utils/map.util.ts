export const formatGender = (gender: string) => {
  return gender.toUpperCase() === "MALE" ? "Nam" : "Nữ";
};

export const formatRoles = (role: string): string => {
  switch (role) {
    case "STUDENT":
      return "Học viên";
    case "TEACHER":
      return "Giáo viên";
    case "ADMIN":
      return "Admin";
    default:
      return role;
  }
};
export const formatIsFree = (type: number) => {
  return type === 1 ? "Miễn phí" : "Cho học viên";
};

export const convertToInteger = (value: string): number => {
  return Math.floor(parseFloat(value));
};
