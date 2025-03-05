import { useCallback, useEffect, useState } from "react";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/get-list-studentInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";

interface DataType {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

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

const StudentTablesPage = () => {
  const [dataStudents, setDataStudents] = useState<IGetListStudents[]>([]);

  const getListStudents = useCallback(() => {
    showLoading();
    const getStudentsSub = getStudentsList().subscribe({
      next: (res) => {
        setDataStudents(res.data);
        removeLoading();
      },
      error: () => {
        removeLoading();
      },
    });
    getStudentsSub.add();
  }, []);

  useEffect(() => {
    getListStudents();
  }, [getListStudents]);
  return (
    <>
      <Table<DataType> columns={columns} dataSource={dataStudents} />
    </>
  );
};

export default StudentTablesPage;
