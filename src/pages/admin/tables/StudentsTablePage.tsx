import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/get-list-studentInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import { deleteStudent } from "@/api/admin/delete-student.api";
import { showToast } from "@/services/toast";
import ActionBlockStudents from "./students/action-block-student";
import AddStudent from "./students/add";

interface DataType {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

type TableQueries = TableQueriesRef<DataType>;

const StudentTablesPage = () => {
  const [dataStudents, setDataStudents] = useState<IGetListStudents[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListStudents = useCallback(() => {
    showLoading();
    const getStudentsSub = getStudentsList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataStudents(res.data);
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
    getStudentsSub.add();
  }, []);

  useEffect(() => {
    getListStudents();
  }, []);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const showDeleteModal = (id: number) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedStudentId) return;
    showLoading();
    const deleteSub = deleteStudent([selectedStudentId]).subscribe({
      next: () => {
        showToast({type: 'success', content: 'Delete successful!' });
        setSelectedRowKeys([]);
        getListStudents();
      },
      error: () => {
        showToast({type: 'error', content: 'Delete failed!' });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedStudentId(null);
      },
    });
    deleteSub.add();
  }, [selectedStudentId]);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListStudents();
  };

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false); 
    getListStudents(); 
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
    { title: "Address", dataIndex: "address", key: "address", align: "center" },
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
          <Button size="middle" danger onClick={() => showDeleteModal(record.id!)} disabled={record.id === 1}>
            <MdOutlineDeleteForever />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
    <ActionBlockStudents onClickAction={onClickAction} selectedRows={selectedRowKeys} getListData={getListStudents} />
      <Table<DataType>
        columns={columns}
        dataSource={dataStudents}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
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

      <AddStudent isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </>
  );
};

export default StudentTablesPage;
