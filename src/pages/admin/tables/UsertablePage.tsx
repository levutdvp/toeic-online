import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { UserRole } from "@/types/permission.type";
import { getUsersList, IGetListUsers } from "@/api/admin/get-list-userInfo.api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TableQueriesRef } from "@/types/pagination.type";
import { initPaging } from "@/consts/paging.const";

interface DataType {
  id?: number;
  username: string;
  email: string;
  role: UserRole[];
  active_status: boolean;
  active_date: boolean;
  is_first?: boolean;
}

type TableQueries = TableQueriesRef<DataType>;

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
const UserTablesPage = () => {
  const [dataUsers, setDataUsers] = useState<IGetListUsers[]>([]);
  const [loading, setLoading] = useState(false);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListUsers = useCallback(() => {
    setLoading(true);
    showLoading();
    const getUsersSub = getUsersList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataUsers(res.data);
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
    getUsersSub.add();
  }, []);

  useEffect(() => {
    getListUsers();
    setLoading(false);
  }, []);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListUsers();
    setLoading(false);
  };
  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={dataUsers}
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        loading={loading}
        rowKey="id"
        onChange={onChangeTable}
      />
    </>
  );
};

export default UserTablesPage;
