import { SortDirection } from "@/types/sort.type";
import { SortOrder } from "antd/es/table/interface";

export const convertSortDirection = (direction: SortOrder) => {
  if (direction === "descend") {
    return SortDirection.DESCENDING;
  } else if (direction === "ascend") {
    return SortDirection.ASCENDING;
  } else {
    return SortDirection.ASCENDING;
  }
};
