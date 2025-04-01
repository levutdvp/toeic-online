import { useCallback, useEffect, useRef, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Input, Modal, Space, Table } from "antd";
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
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { FcViewDetails } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import ModalTeacherDetail from "./teachers/detail";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalDetail, setModalDetail] = useState<{
    open: boolean;
    teacherId: number | null;
  }>({
    open: false,
    teacherId: null,
  });

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const navigate = useNavigate();
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

  const handleViewDetails = (record: IGetListTeachers) => {
    navigate(`/admin/users-teacher/${record.id}`);
  };

  const filteredTeachers = dataTeachers.filter((teacher) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (teacher.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (teacher.email?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (teacher.phone?.toLowerCase() || "").includes(lowerSearchTerm)
    );
  });

  const columns: TableProps<IGetListTeachers>["columns"] = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      align: "center",
      render: (dob: string) => {
        return dob ? dayjs(dob).format("DD-MM-YYYY") : "";
      },
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
    // {
    //   title: "Bằng cấp",
    //   dataIndex: "certificate",
    //   key: "certificate",
    //   align: "center",
    //   render: (certificates: ICertificate[]) =>
    //     certificates?.length
    //       ? certificates
    //           .map((cert) => `${cert.certificate_name} - ${cert.score}`)
    //           .join(", ")
    //       : "Chưa có",
    // },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
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
            <Button size="middle" onClick={() => handleViewDetails(record)}>
              <FcViewDetails />
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleOpenDetailModal = (record: IGetListTeachers) => {
    setModalDetail({
      open: true,
      teacherId: record.id ?? null,
    });
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Input
          placeholder="Tìm theo tên, email hoặc số điện thoại"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
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
        dataSource={filteredTeachers}
        rowSelection={rowSelection}
        onChange={onChangeTable}
        onRow={(record) => {
          return {
            onDoubleClick: () => handleOpenDetailModal(record),
          };
        }}
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

      {modalDetail.open && !!modalDetail.teacherId && (
        <ModalTeacherDetail
          teacherId={modalDetail.teacherId}
          onClose={() => setModalDetail({ open: false, teacherId: null })}
        />
      )}
    </>
  );
};

export default TeachersTablePage;
