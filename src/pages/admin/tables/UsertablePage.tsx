import { useCallback, useEffect, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Space, Table } from "antd";
import type { TableProps } from "antd";
import { UserRole } from "@/types/permission.type";
import { getUsersList, IGetListUsers } from "@/api/admin/get-list-userInfo.api";

interface DataType {
  id?: number;
  username: string;
  email: string;
  role: UserRole[];
  active_status: boolean;
  active_date: boolean;
  is_first?: boolean;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Username",
    dataIndex: "username'",
    key: "username",
    width: 200,
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
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 300,
    align: "center",
  },
  {
    title: "Active Status",
    dataIndex: "active_status",
    key: "active_status",
    align: "center",
  },
  {
    title: "Active Date",
    dataIndex: "active_date",
    key: "active_date",
    align: "center",
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    width: 200,
    render: () => (
      <Space size="middle">
        <a>Update</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const UserTablesPage = () => {
  const [dataUsers, setDataUsers] = useState<IGetListUsers[]>([]);

  const getListUsers = useCallback(() => {
    showLoading();
    const getTeachersSub = getUsersList().subscribe({
      next: (res) => {
        setDataUsers(res.data);
        removeLoading();
      },
      error: () => {
        removeLoading();
      },
    });
    getTeachersSub.add();
  }, []);

  useEffect(() => {
    getListUsers();
  }, [getListUsers]);
  return (
    <>
      <Table<DataType> columns={columns} dataSource={dataUsers} />
    </>
  );
};

export default UserTablesPage;
