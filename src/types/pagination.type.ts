import { TablePaginationConfig } from "antd";

export type Pagination = TablePaginationConfig;

export interface TableQueriesRef<DataType>
  extends Pick<Pagination, "current" | "pageSize" | "total"> {
  current: number;
  pageSize: number;
  totalPage?: number;
  data?: DataType[];
}
