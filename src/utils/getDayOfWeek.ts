import dayjs from "dayjs";

export const getShortDayOfWeek = (dateString: string): string => {
  let date;
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    date = dayjs(`${year}-${month}-${day}`);
  } else {
    date = dayjs(dateString);
  }

  if (!date.isValid()) {
    return "Ngày không hợp lệ";
  }

  const dayOfWeek = date.day();

  const shortDaysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return shortDaysOfWeek[dayOfWeek];
};
