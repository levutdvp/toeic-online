import { deleteClass } from "@/api/admin/api-classes/delete-class.api";
import {
  getClassesList,
  IGetListClasses,
} from "@/api/admin/api-classes/get-list-class.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { TableQueriesRef } from "@/types/pagination.type";
import { Button, Input, Modal, Space, Table, TableProps, Tag } from "antd";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import ActionBlockClasses from "./classes/action-block-class";
import AddClass from "./classes/add";
import EditClass from "./classes/edit";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ModalDetailClass from "./classes/detail";
import { useAuth } from "@/hooks/use-auth.hook";

type TableQueries = TableQueriesRef<IGetListClasses>;

type ModalDetailProps = {
  open: boolean;
  classId: number | null;
  classCode: string;
  className: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  teacher: string;
  days: string[];
};

const ClassTablesPage = () => {
  const modalDetailInitState: ModalDetailProps = {
    open: false,
    classId: null,
    classCode: "",
    className: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    teacher: "",
    days: [],
  };

  const [dataClasses, setDataClasses] = useState<IGetListClasses[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListClasses[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListClasses>();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [openModalDetail, setOpenModalDetail] =
    useState<ModalDetailProps>(modalDetailInitState);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const { userRoles, userInfo } = useAuth();

  const isTeacher = userRoles.some((role) => role === "TEACHER");
  const isAdmin = userRoles.some((role) => role === "ADMIN");

  const getListClasses = useCallback(() => {
    showLoading();
    const getClassesSub = getClassesList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        // Filter classes based on teacher's name if user is a teacher
        let filteredData = res.data;
        if (isTeacher && !isAdmin && userInfo) {
          filteredData = res.data.filter(
            (cls) => cls.teacher === userInfo.fullName
          );
        }
        
        setDataClasses(filteredData);
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
    getClassesSub.add();
  }, [isTeacher, isAdmin, userInfo]);

  useEffect(() => {
    getListClasses();
  }, [getListClasses]);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: IGetListClasses[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const showDeleteModal = (id: number) => {
    if (isTeacher) {
      showToast({
        type: "error",
        content: "Bạn không có quyền thực hiện chức năng này!",
      });
      return;
    }
    setSelectedClassId(id);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedClassId(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedClassId) return;
    showLoading();
    const deleteSub = deleteClass([selectedClassId]).subscribe({
      next: () => {
        showToast({ type: "success", content: "Xóa thành công!" });
        setSelectedRowKeys([]);
        getListClasses();
      },
      error: () => {
        showToast({ type: "error", content: "Xóa thất bại!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedClassId(null);
      },
    });
    deleteSub.add();
  }, [selectedClassId]);

  const onChangeTable: TableProps<IGetListClasses>["onChange"] = (
    pagination
  ) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListClasses();
  };

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListClasses();
  };

  const handleOpenEditModal = (record: IGetListClasses) => {
    if (isTeacher) {
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
    getListClasses();
  };

  const filteredClasses = dataClasses.filter((cls) =>
    (cls.class_type ? cls.class_type.toLowerCase() : "").includes(
      searchText.toLowerCase()
    )
  );

  const handleOpenDetailModal = (record: IGetListClasses) => {
    setOpenModalDetail({
      open: true,
      classId: record.id ?? null,
      className: record.class_type,
      classCode: record.class_code,
      startDate: record.start_date,
      endDate: record.end_date,
      startTime: record.start_time,
      endTime: record.end_time,
      teacher: record.teacher,
      days: record.days,
    });
  };

  // Hàm biến đổi các giá trị thứ thành các màu tag khác nhau
  const getDayTagColor = (day: string) => {
    switch (day) {
      case "T2":
        return "blue";
      case "T3":
        return "green";
      case "T4":
        return "purple";
      case "T5":
        return "cyan";
      case "T6":
        return "magenta";
      case "T7":
        return "orange";
      case "CN":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableProps<IGetListClasses>["columns"] = useMemo(() => {
    const baseColumns = [
      {
        title: "Mã lớp",
        dataIndex: "class_type",
        key: "class_type",
        align: "center" as const,      },
      {
        title: "Tên lớp",
        dataIndex: "class_code",
        key: "class_code",
        align: "center" as const,
      },  
      {
        title: "Ngày bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        align: "center" as const,
        render: (start_date: string) => {
          return start_date ? dayjs(start_date).format("DD-MM-YYYY") : "";
        },
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "end_date",
        key: "end_date",
        align: "center" as const,
        render: (end_date: string) => {
          return end_date ? dayjs(end_date).format("DD-MM-YYYY") : "";
        },
      },
      {
        title: "Thời gian bắt đầu",
        dataIndex: "start_time",
        key: "start_time",
        align: "center" as const,
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "end_time",
        key: "end_time",
        align: "center" as const,
      },
      {
        title: "Lịch học",
        dataIndex: "days",
        key: "days",
        align: "center" as const,
        render: (days: string[]) => (
          <Space size={[0, 8]} wrap>
            {days.map((day, idx) => (
              <Tag color={getDayTagColor(day)} key={idx}>
                {day}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: "Số lượng học viên",
        dataIndex: "number_of_students",
        key: "number_of_students",
        align: "center" as const,
      },
      {
        title: "Giáo viên phụ trách",
        dataIndex: "teacher",
        key: "teacher",
        align: "center" as const,
      },
    ];

    if (isAdmin) {
      return [
        ...baseColumns,
        {
          title: "Hành động",
          key: "action",
          align: "center" as const,
          width: 200,
          render: (_: unknown, record: IGetListClasses) => (
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
    }

    return baseColumns;
  }, [isAdmin]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { open, ...modalDetailProps } = openModalDetail;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên lớp học"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <ActionBlockClasses
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListClasses}
      />
      <Table<IGetListClasses>
        columns={columns}
        dataSource={filteredClasses}
        rowKey="id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        onChange={onChangeTable}
        rowSelection={rowSelection}
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

      <AddClass isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditClass
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />

      {openModalDetail.open && !!openModalDetail.classId && (
        <ModalDetailClass
          {...modalDetailProps}
          classId={openModalDetail.classId}
          onClose={() => setOpenModalDetail(modalDetailInitState)}
        />
      )}
    </>
  );
};

export default ClassTablesPage;
