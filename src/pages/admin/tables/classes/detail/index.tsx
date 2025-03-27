import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import { formatGender } from "@/utils/map.util";
import {
  getListDetailClass,
  IStudentRes,
} from "@/api/admin/api-classes/get-list-detail-class.api";
import { useLocation } from "react-router-dom";
import ActionBlockDetailClass from "./action-block-detail-class";
import AddStudentDetailClass from "./add";
import EditStudentDetailClass from "./edit";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { showToast } from "@/services/toast";
import { deleteStudent } from "@/api/admin/api-students/delete-student.api";

type TableQueries = TableQueriesRef<IStudentRes>;

const DetailClass = () => {
  const [studentsDetail, setStudentsDetail] = useState<IStudentRes[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IStudentRes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IStudentRes>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const location = useLocation();
  const { classId, className } = location.state || {};

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListStudentsDetail = useCallback(() => {
    showLoading();
    const params = {
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    };
    const getStudentsSub = getListDetailClass(classId, params).subscribe({
      next: (res) => {
        setStudentsDetail(res.data.students || []);
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
    getListStudentsDetail();
  }, [getListStudentsDetail]);

  const rowSelection = {
    onChange: (_: any, selectedRows: IStudentRes[]) => {
      setSelectedRowKeys(selectedRows);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const onChangeTable: TableProps<IStudentRes>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListStudentsDetail();
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
        showToast({ type: "success", content: "Xóa thành công!" });
        setSelectedRowKeys([]);
        getListStudentsDetail();
      },
      error: () => {
        showToast({ type: "error", content: "Xóa thất bại!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedStudentId(null);
      },
    });
    deleteSub.add();
  }, [selectedStudentId]);

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListStudentsDetail();
  };

  const handleOpenEditModal = (record: IStudentRes) => {
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListStudentsDetail();
  };

  const columns: TableProps<IStudentRes>["columns"] = [
    {
      title: "Họ và tên",
      key: "full_name",
      align: "center",
      render: (_, record) =>
        record.full_name ||
        `${record.first_name ?? ""} ${record.last_name ?? ""}`,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "birth_date",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      render: (gender) => gender && formatGender(gender),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button size="middle" onClick={() => handleOpenEditModal(record)}>
            <CiEdit />
          </Button>
          <Button
            size="middle"
            danger
            onClick={() => showDeleteModal(record.id!)}
          >
            <MdOutlineDeleteForever />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ActionBlockDetailClass
        className={className}
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListStudentsDetail}
      />
      <Table<IStudentRes>
        columns={columns}
        dataSource={studentsDetail}
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
      <AddStudentDetailClass
        classId={classId}
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />
      <EditStudentDetailClass
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />
    </>
  );
};

export default DetailClass;
