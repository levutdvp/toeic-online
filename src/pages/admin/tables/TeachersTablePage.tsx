import { useCallback, useEffect, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Space, Table } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import {
  getTeachersList,
  IGetListTeachers,
  IParams,
} from "@/api/admin/get-list-teacherInfo.api";
import { CiEdit } from "react-icons/ci";

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
        <Button size="small">
          <CiEdit />
        </Button>
        <a>Delete</a>
      </Space>
    ),
  },
];
const TeachersTablePage = () => {
  const [dataTeachers, setDataTeachers] = useState<IGetListTeachers[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (page, pageSize) => {
      setPagination({ ...pagination, current: page, pageSize });
    },
  });

  const getListTeachers = useCallback((params: IParams) => {
    setLoading(true);
    showLoading();
    const getTeachersSub = getTeachersList(params).subscribe({
      next: (res) => {
        setDataTeachers(res.data);
        setPagination((prev) => ({
          ...prev,
          total: res.meta?.total || 0,
          current: params.pageNumber,
          pageSize: params.pageSize,
        }));
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
  }, [getListTeachers]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
    });
  };
  return (
    <>
      <Table<DataType>
        columns={columns}
        rowKey="id"
        pagination={pagination}
        dataSource={dataTeachers}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TeachersTablePage;
