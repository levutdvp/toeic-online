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

const TeachersTablePage = () => {
  const [dataTeachers, setDataTeachers] = useState<IGetListTeachers[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );

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
    onChange: (_: any, selectedRowKeys: DataType[]) => {
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
        showToast({ type: "success", content: "Delete successful!" });
        setSelectedRowKeys([]);
        getListTeachers();
      },
      error: () => {
        showToast({ type: "error", content: "Delete failed!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedTeacherId(null);
      },
    });
    deleteSub.add();
  }, [selectedTeacherId]);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
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
      render: (_, record) => (
        <Space size="middle">
          <Button size="middle">
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
        rowSelection={rowSelection}
        onChange={onChangeTable}
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

      <AddTeacher isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </>
  );
};

export default TeachersTablePage;
