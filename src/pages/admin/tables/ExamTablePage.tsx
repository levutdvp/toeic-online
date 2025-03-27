import { useCallback, useEffect, useRef, useState } from "react";

import { removeLoading, showLoading } from "@/services/loading";
import { Button, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import { showToast } from "@/services/toast";
import { getListExam, IGetListTest } from "@/api/client/get-list-test.api";
import ActionBlockExams from "./exams/action-block-exam";
import { formatIsFree } from "@/utils/map.util";
import AddExam from "./exams/add";
import EditExam from "./exams/edit";
import { deleteExams } from "@/api/admin/api-exam/delete-exam.api";

type TableQueries = TableQueriesRef<IGetListTest>;

const ExamTablePage = () => {
  const [dataExams, setDataExams] = useState<IGetListTest[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<IGetListTest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListTest>();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListExams = useCallback(() => {
    showLoading();
    const getStudentsSub = getListExam({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setDataExams(res.data);
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
    getListExams();
  }, [getListExams]);

  const rowSelection = {
    onChange: (_: any, selectedRowKeys: IGetListTest[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined),
  };

  const showDeleteModal = (id: number) => {
    setSelectedExamId(id);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedExamId(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedExamId) return;
    showLoading();
    const deleteSub = deleteExams([selectedExamId]).subscribe({
      next: () => {
        showToast({ type: "success", content: "Xóa thành công!" });
        setSelectedRowKeys([]);
        getListExams();
      },
      error: () => {
        showToast({ type: "error", content: "Xóa thất bại!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedExamId(null);
      },
    });
    deleteSub.add();
  }, [selectedExamId]);

  const onChangeTable: TableProps<IGetListTest>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListExams();
  };

  const onClickAction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    getListExams();
  };

  const handleOpenEditModal = (record: IGetListTest) => {
    setRecordSelected(record);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getListExams();
  };

  const columns: TableProps<IGetListTest>["columns"] = [
    {
      title: "Mã đề thi",
      dataIndex: "exam_code",
      key: "exam_code",
      align: "center",
    },
    {
      title: "Tên đề thi",
      dataIndex: "exam_name",
      key: "exam_name",
      align: "center",
    },
    {
      title: "Thời lượng (Phút)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Part",
      dataIndex: "part_number",
      key: "part_number",
      align: "center",
    },
    {
      title: "Phần thi",
      dataIndex: "section_name",
      key: "section_name",
      align: "center",
    },
    {
      title: "Số lượng câu hỏi",
      dataIndex: "question_count",
      key: "question_count",
      align: "center",
    },
    {
      title: "Số điểm tối đa đạt được",
      dataIndex: "max_score",
      key: "max_score",
      align: "center",
    },
    {
      title: "Loại đề thi",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Miễn phí",
      dataIndex: "is_Free",
      key: "is_Free",
      align: "center",
      render: (isFree) => formatIsFree(isFree),
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
        </Space>
      ),
    },
  ];
  return (
    <>
      <ActionBlockExams
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListExams}
      />
      <Table<IGetListTest>
        columns={columns}
        dataSource={dataExams}
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

      <AddExam isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditExam
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
      />
    </>
  );
};

export default ExamTablePage;
