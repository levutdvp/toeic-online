import { deleteClass } from "@/api/admin/api-classes/delete-class.api";
import {
  getClassesList,
  IGetListClasses,
} from "@/api/admin/api-classes/get-list-class.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { TableQueriesRef } from "@/types/pagination.type";
import { Button, Input, Modal, Space, Table, TableProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import ActionBlockClasses from "./classes/action-block-class";
import AddClass from "./classes/add";
import EditClass from "./classes/edit";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

type TableQueries = TableQueriesRef<IGetListClasses>;

const ClassTablesPage = () => {
  const [dataClasses, setDataClasses] = useState<IGetListClasses[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListClasses[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListClasses>();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListClasses = useCallback(() => {
    showLoading();
    const getClassesSub = getClassesList({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataClasses(res.data);
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
  }, []);

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
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListClasses();
  };

  const handleViewDetail = (record: IGetListClasses) => {
    navigate(`/admin/classes/detail`, {
      state: { classId: record.id, className: record.class_type },
    });
  };

  const filteredClasses = dataClasses.filter((cls) =>
    (cls.class_type ? cls.class_type.toLowerCase() : "").includes(
      searchText.toLowerCase()
    )
  );

  const columns: TableProps<IGetListClasses>["columns"] = [
    {
      title: "Tên lớp",
      dataIndex: "class_type",
      key: "class_type",
      align: "center",
    },
    {
      title: "Mã lớp",
      dataIndex: "class_code",
      key: "class_code",
      align: "center",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      align: "center",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      align: "center",
    },
    {
      title: "Lịch học",
      dataIndex: "days",
      key: "days",
      align: "center",
      render: (days: string[]) => (
        <div>
          {days.map((day, idx) => (
            <div key={idx}>{day}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Số lượng học viên",
      dataIndex: "number_of_students",
      key: "number_of_students",
      align: "center",
    },
    {
      title: "Giáo viên phụ trách",
      dataIndex: "teacher",
      key: "teacher",
      align: "center",
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
          >
            <MdOutlineDeleteForever />
          </Button>
          <Button size="middle" onClick={() => handleViewDetail(record)}>
            <FcViewDetails />
          </Button>
        </Space>
      ),
    },
  ];

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
    </>
  );
};

export default ClassTablesPage;
