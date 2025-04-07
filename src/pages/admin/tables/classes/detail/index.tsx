import {
  getListDetailClass,
  IStudentRes,
} from "@/api/admin/api-classes/get-list-detail-class.api";
import { deleteStudent } from "@/api/admin/api-students/delete-student.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { TableQueriesRef } from "@/types/pagination.type";
import { formatGender } from "@/utils/map.util";
import type { TableProps } from "antd";
import { Button, Modal, Space, Table } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import ActionBlockDetailClass from "./action-block-detail-class";
import AddStudentDetailClass from "./add";
import EditStudentDetailClass from "./edit";
import { useAuth } from "@/hooks/use-auth.hook";

type TableQueries = TableQueriesRef<IStudentRes>;

const ModalDetailClass = ({
  onClose,
  classId,
  className,
  classCode,
  startDate,
  endDate,
  startTime,
  endTime,
  teacher,
  days,
}: {
  onClose: () => void;
  classId: number;
  className: string;
  classCode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  teacher: string;
  days: string[];
}) => {
  const [studentsDetail, setStudentsDetail] = useState<IStudentRes[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IStudentRes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IStudentRes>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const daysOfWeek = useMemo(() => {
    return days;
  }, [days]);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
    total: initPaging.total,
  });

  const { userRoles } = useAuth();

  const isTeacher = userRoles.some((role) => role === "TEACHER");

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
    if (isTeacher) {
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
      render: (birth_date) =>
        birth_date ? dayjs(birth_date).format("DD-MM-YYYY") : "-",
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
    ...(isTeacher ? [] : [{
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: unknown, record: IStudentRes) => (
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
    }]),
  ];

  return (
    <>
      <Modal
        title="Thông tin lớp học"
        open={true}
        onOk={onClose}
        onCancel={onClose}
        width={1000}
        footer={false}
      >
        {/* detail class */}
        <div className="my-5 border-b border-gray-200">
          <h3 className="text-lg font-bold mb-5">
            Chi tiết lớp học {className}
          </h3>
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-5 mb-4">
                <div className="min-w-[300px]">
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">Mã lớp học:</div>
                    <div>{classCode}</div>
                  </div>
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">Tên lớp học:</div>
                    <div>{className}</div>
                  </div>
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">
                      Số lượng học viên:
                    </div>
                    <div>{tableQueriesRef.current.total}</div>
                  </div>
                </div>

                <div className="min-w-[300px]">
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">
                      Thời gian bắt đầu:
                    </div>
                    <div>{dayjs(startDate).format("DD-MM-YYYY")}</div>
                  </div>
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">
                      Thời gian kết thúc:
                    </div>
                    <div>{dayjs(endDate).format("DD-MM-YYYY")}</div>
                  </div>
                  <div className="flex mb-2.5">
                    <div className="font-bold w-[150px]">Lịch học:</div>
                    <div>
                      {startTime} - {endTime} ||{" "}
                      {daysOfWeek
                        .map((day) => {
                          const dayMapping: Record<string, string> = {
                            T2: "Thứ 2",
                            T3: "Thứ 3",
                            T4: "Thứ 4",
                            T5: "Thứ 5",
                            T6: "Thứ 6",
                            T7: "Thứ 7",
                            CN: "Chủ nhật",
                          };
                          return dayMapping[day] || day;
                        })
                        .join(", ")}
                    </div>
                  </div>
                </div>

                <div className="min-w-[300px]">
                  <div className="flex mb-2.5 gap-2.5">
                    <div className="font-bold ml-2.5">Giáo viên:</div>
                    <div>{teacher}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* action block */}
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
        {
          <AddStudentDetailClass
            classId={classId}
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
          />
        }
        <EditStudentDetailClass
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          recordSelected={recordSelected}
        />
      </Modal>
    </>
  );
};

export default ModalDetailClass;
