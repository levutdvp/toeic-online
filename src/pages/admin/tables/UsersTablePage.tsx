import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  getUsersList,
  IGetListUsers,
} from "@/api/admin/api-users/get-list-userInfo.api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TableQueriesRef } from "@/types/pagination.type";
import { initPaging } from "@/consts/paging.const";
import { showToast } from "@/services/toast";
import { deleteUser } from "@/api/admin/api-users/delete-user.api";
import ActionBlockUsers from "./users/action-block-user";
import AddUser from "./users/add";
import EditUser from "./users/edit";

type TableQueries = TableQueriesRef<IGetListUsers>;

const UserTablesPage = () => {
  const [dataUsers, setDataUsers] = useState<IGetListUsers[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListUsers[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListUsers>();

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListUsers = useCallback(() => {
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
      },
    });
    getUsersSub.add();
  }, []);

  useEffect(() => {
    getListUsers();
  }, [getListUsers]);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: IGetListUsers[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const onChangeTable: TableProps<IGetListUsers>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListUsers();
  };

  const showDeleteModal = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedUserId) return;
    showLoading();
    const deleteSub = deleteUser([selectedUserId]).subscribe({
      next: () => {
        showToast({ type: "success", content: "Delete successful!" });
        setSelectedRowKeys([]);
        getListUsers();
      },
      error: () => {
        showToast({ type: "error", content: "Delete failed!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedUserId(null);
      },
    });
    deleteSub.add();
  }, [selectedUserId]);

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListUsers();
  };

  const handleOpenEditModal = (record: IGetListUsers) => {
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListUsers();
  };

  const columns: TableProps<IGetListUsers>["columns"] = [
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
      render: (role: string) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
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
      render: (_, record) => (
        <Space size="middle">
          <Button size="middle" onClick={() => handleOpenEditModal(record)}>
            <CiEdit />
          </Button>
          <Button
            size="middle"
            danger
            onClick={() => showDeleteModal(record.id!)}
            disabled={record.id === 1}
          >
            <MdOutlineDeleteForever />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <ActionBlockUsers
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListUsers}
      />
      <Table<IGetListUsers>
        columns={columns}
        dataSource={dataUsers}
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        rowKey="id"
        onChange={onChangeTable}
        rowSelection={rowSelection}
      />

      <Modal
        title="Confirm deletion"
        open={isModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Do you want to delete?</p>
      </Modal>

      <AddUser isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditUser
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />
    </>
  );
};

export default UserTablesPage;
