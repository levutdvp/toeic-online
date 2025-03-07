import {
  getClassesList,
  IGetListClasses,
} from "@/api/admin/get-list-class.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { TableQueriesRef } from "@/types/pagination.type";
import { Button, Space, Table, TableProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";

interface DataType {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
}

type TableQueries = TableQueriesRef<DataType>;

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Class Name",
    dataIndex: "class_type",
    key: "class_type",
    align: "center",
  },
  {
    title: "Class Code",
    dataIndex: "class_code",
    key: "class_code",
    align: "center",
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    align: "center",
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    align: "center",
  },
  {
    title: "Start Time",
    dataIndex: "start_time",
    key: "start_time",
    align: "center",
  },
  {
    title: "End Time",
    dataIndex: "end_time",
    key: "end_time",
    align: "center",
  },
  {
    title: "Schedule",
    dataIndex: "days",
    key: "days",
    align: "center",
  },
  {
    title: "Number of Students",
    dataIndex: "number_of_students",
    key: "number_of_students",
    align: "center",
  },
  {
    title: "Teacher",
    dataIndex: "teacher",
    key: "teacher",
    align: "center",
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    width: 200,
    render: () => (
      <Space size="middle">
        <Button size="middle">
          <CiEdit />
        </Button>
        <Button size="middle">
          <MdOutlineDeleteForever />
        </Button>
      </Space>
    ),
  },
];

const ClassTablesPage = () => {
  const [dataClasses, setDataClasses] = useState<IGetListClasses[]>([]);
  const [loading, setLoading] = useState(false);
  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListClasses = useCallback(() => {
    setLoading(true);
    showLoading();
    const getClassesSub = getClassesList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataClasses(res.data);
        tableQueriesRef.current = {
          ...tableQueriesRef.current,
          current: res.meta.pageCurrent,
          pageSize: res.meta.pageSize,
          totalPage: res.meta.totalPage,
          total: res.meta.total,
        };
        removeLoading();
      },
      error: () => {
        removeLoading();
      },
    });
    getClassesSub.add();
  }, []);

  useEffect(() => {
    getListClasses();
    setLoading(false);
  }, []);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListClasses();
    setLoading(false);
  };

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={dataClasses}
        rowKey="id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        loading={loading}
        onChange={onChangeTable}
      />
    </>
  );
};

export default ClassTablesPage;
