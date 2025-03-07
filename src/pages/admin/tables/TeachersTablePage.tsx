import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/get-list-teacherInfo.api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TableQueriesRef } from "../../../types/pagination.type";
import { initPaging } from "@/consts/paging.const";

interface DataType {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  certificate: string[];
}

type TableQueries = TableQueriesRef<DataType>;

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
    align: "center",
  },
  {
    title: "Date of Birth",
    dataIndex: "dob",
    key: "dob",
    width: 200,
    align: "center",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    width: 200,
    align: "center",
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
    width: 250,
    align: "center",
  },
  {
    title: "Email Address",
    dataIndex: "email",
    key: "email",
    width: 300,
    align: "center",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "Certificates",
    dataIndex: "certificate",
    key: "certificate",
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
const TeachersTablePage = () => {
  const [dataTeachers, setDataTeachers] = useState<IGetListTeachers[]>([]);
  const [loading, setLoading] = useState(false);
  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListTeachers = useCallback(() => {
    setLoading(true);
    showLoading();
    const getTeachersSub = getTeachersList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataTeachers(res.data);
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
        setLoading(false);
      },
    });
    getTeachersSub.add();
  }, []);

  useEffect(() => {
    getListTeachers();
    setLoading(false);
  }, []);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListTeachers();
    setLoading(false);
  };
  return (
    <>
      <Table<DataType>
        columns={columns}
        rowKey="id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.totalPage,
        }}
        dataSource={dataTeachers}
        loading={loading}
        onChange={onChangeTable}
      />
    </>
  );
};

export default TeachersTablePage;
