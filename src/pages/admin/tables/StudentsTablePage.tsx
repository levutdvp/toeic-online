import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/api-students/get-list-studentInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, Input, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import { deleteStudent } from "@/api/admin/api-students/delete-student.api";
import { showToast } from "@/services/toast";
import ActionBlockStudents from "./students/action-block-student";
import AddStudent from "./students/add";
import EditStudent from "./students/edit";
import { formatGender } from "@/utils/map.util";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/use-auth.hook";

type TableQueries = TableQueriesRef<IGetListStudents>;

const StudentTablesPage = () => {
  const [dataStudents, setDataStudents] = useState<IGetListStudents[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListStudents[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListStudents>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const { userRoles } = useAuth();

  const editPermissions = userRoles.some((role) => role === "TEACHER");

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
  }, [getListStudents]);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: IGetListStudents[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const showDeleteModal = (id: number) => {
    if (editPermissions) {
      showToast({
        type: "error",
        content: "Bạn không có quyền thực hiện chức năng này!",
      });
      return;
    }
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
        getListStudents();
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

  const onChangeTable: TableProps<IGetListStudents>["onChange"] = (
    pagination
  ) => {
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

  const handleOpenEditModal = (record: IGetListStudents) => {
    if (editPermissions) {
      showToast({
        type: "error",
        content: "Bạn không có quyền thực hiện chức năng này!",
      });
      return;
    }
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListStudents();
  };

  const filteredStudents = dataStudents.filter((student) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (student.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (student.email?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (student.phone?.toLowerCase() || "").includes(lowerSearchTerm)
    );
  });

  const columns: TableProps<IGetListStudents>["columns"] = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 200,
      align: "center",
      render: (dob: string) => {
        return dob ? dayjs(dob).format("DD-MM-YYYY") : "";
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 200,
      align: "center",
      render: (gender) => gender && formatGender(gender),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 250,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300,
      align: "center",
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", align: "center" },
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
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Input
          placeholder="Tìm theo tên, email hoặc số điện thoại"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <ActionBlockStudents
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListStudents}
      />
      <Table<IGetListStudents>
        columns={columns}
        dataSource={filteredStudents}
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

      <AddStudent isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditStudent
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />
    </>
  );
};

export default StudentTablesPage;
