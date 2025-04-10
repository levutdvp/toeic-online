import { deleteUser } from "@/api/admin/api-users/delete-user.api";
import {
  getUsersList,
  IGetListUsers,
} from "@/api/admin/api-users/get-list-userInfo.api";
import { editStatusUser } from "@/api/admin/api-users/update-status-user.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { TableQueriesRef } from "@/types/pagination.type";
import { formatRoles } from "@/utils/map.util";
import { SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Input, Modal, Select, Space, Switch, Table } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import ActionBlockUsers from "./users/action-block-user";
import AddUser from "./users/add";

type TableQueries = TableQueriesRef<IGetListUsers>;

const UserTablesPage = () => {
  const [dataUsers, setDataUsers] = useState<IGetListUsers[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListUsers[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filterRole, setFilterRole] = useState<
    "ADMIN" | "STUDENT" | "TEACHER" | null
  >(null);

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
        let filteredData = res.data;
        if (filterRole) {
          filteredData = res.data.filter((user) =>
            user.role.includes(filterRole)
          );
        }
        setDataUsers(filteredData);
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
  }, [filterRole]);

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
        showToast({ type: "success", content: "Xóa thành công!" });
        setSelectedRowKeys([]);
        getListUsers();
      },
      error: () => {
        showToast({ type: "error", content: "Xóa thất bại!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedUserId(null);
      },
    });
    deleteSub.add();
  }, [selectedUserId]);

  const handleToggleStatus = (checked: boolean, record: IGetListUsers) => {
    showLoading();
    const toggleSub = editStatusUser({
      id: record.id,
      statusUpdateUser: checked,
    }).subscribe({
      next: () => {
        showToast({
          type: "success",
          content: "Cập nhật trạng thái thành công!",
        });
        removeLoading();
        setDataUsers((prev) =>
          prev.map((user) =>
            user.id === record.id ? { ...user, active_status: checked } : user
          )
        );
      },
      error: () => {
        showToast({ type: "error", content: "Cập nhật trạng thái thất bại!" });
      },
    });
    toggleSub.add();
  };

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListUsers();
  };

  const filteredUsers = dataUsers.filter((user) =>
    (user.username ? user.username.toLowerCase() : "").includes(
      searchText.toLowerCase()
    )
  );

  const columns: TableProps<IGetListUsers>["columns"] = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: string) => formatRoles(role),
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "active_status",
      key: "active_status",
      align: "center",
      render: (activeStatus: boolean, record) => (
        <Switch
          checked={activeStatus}
          disabled={record?.id === 1}
          onChange={(checked) => handleToggleStatus(checked, record)}
        />
      ),
    },

    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button size="middle" onClick={() => handleOpenEditModal(record)}>
            <CiEdit />
          </Button> */}
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
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên người dùng"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Lọc theo quyền"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => {
            tableQueriesRef.current.current = 1;
            setFilterRole(value || null);
          }}
          options={[
            { label: "Admin", value: "ADMIN" },
            { label: "Học viên", value: "STUDENT" },
            { label: "Giáo viên", value: "TEACHER" },
          ]}
        />
      </Space>
      <ActionBlockUsers
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListUsers}
      />
      <Table<IGetListUsers>
        columns={columns}
        dataSource={filteredUsers}
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
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa?</p>
      </Modal>

      <AddUser isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      {/* <EditUser
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      /> */}
    </>
  );
};

export default UserTablesPage;
