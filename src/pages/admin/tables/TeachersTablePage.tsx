import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TableQueriesRef } from "../../../types/pagination.type";
import { initPaging } from "@/consts/paging.const";
import ActionBlockTeachers from "./teachers/action-block-teacher";
import AddTeacher from "./teachers/add";
import { showToast } from "@/services/toast";
import { deleteTeacher } from "@/api/admin/api-teachers/delete-teacher.api";
import EditTeacher from "./teachers/edit";
import { formatGender } from "@/utils/map.util";

type TableQueries = TableQueriesRef<IGetListTeachers>;

const TeachersTablePage = () => {
  const [dataTeachers, setDataTeachers] = useState<IGetListTeachers[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListTeachers[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListTeachers>();

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListTeachers = useCallback(() => {
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
      },
    });
    getTeachersSub.add();
  }, []);

  useEffect(() => {
    getListTeachers();
  }, [getListTeachers]);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: IGetListTeachers[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const showDeleteModal = (id: number) => {
    setSelectedTeacherId(id);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedTeacherId(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedTeacherId) return;
    showLoading();
    const deleteSub = deleteTeacher([selectedTeacherId]).subscribe({
      next: () => {
        showToast({ type: "success", content: "Xóa thành công!" });
        setSelectedRowKeys([]);
        getListTeachers();
      },
      error: () => {
        showToast({ type: "error", content: "Xóa thất bại!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedTeacherId(null);
      },
    });
    deleteSub.add();
  }, [selectedTeacherId]);

  const onChangeTable: TableProps<IGetListTeachers>["onChange"] = (
    pagination
  ) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListTeachers();
  };

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListTeachers();
  };

  const handleOpenEditModal = (record: IGetListTeachers) => {
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListTeachers();
  };

  const columns: TableProps<IGetListTeachers>["columns"] = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 170,
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 150,
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: (gender) => gender && formatGender(gender),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Bằng cấp",
      dataIndex: "certificate",
      key: "certificate",
      align: "center",
      render: (certificates) => (certificates ? certificates.join(", ") : ""),
    },
    {
      title: "Hành động",
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
      <ActionBlockTeachers
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListTeachers}
      />
      <Table<IGetListTeachers>
        columns={columns}
        rowKey="id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.totalPage,
        }}
        dataSource={dataTeachers}
        rowSelection={rowSelection}
        onChange={onChangeTable}
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

      <AddTeacher isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditTeacher
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />
    </>
  );
};

export default TeachersTablePage;
