import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Modal, Space, Table } from "antd";
import {
  getExamHistory,
  IGetListExamHistory,
} from "@/api/common/exam-history.api";
import { showLoading, removeLoading } from "@/services/loading";
import dayjs from "dayjs";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import type { TableProps } from "antd";
import { TiDocumentText } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

interface ExamHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
}

type TableQueries = TableQueriesRef<IGetListExamHistory>;

const ExamHistoryModal = ({
  isOpen,
  onClose,
  studentId,
}: ExamHistoryModalProps) => {
  const [examHistory, setExamHistory] = useState<IGetListExamHistory[]>([]);
  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });
  const navigate = useNavigate();

  const getListExamHistory = useCallback(() => {
    if (!studentId) return;
    showLoading();
    const getHistorySub = getExamHistory(studentId, {
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        setExamHistory(res.data);
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
    getHistorySub.add();
  }, [studentId]);

  useEffect(() => {
    if (isOpen) {
      getListExamHistory();
    }
  }, [isOpen, getListExamHistory]);

  const onChangeTable: TableProps<IGetListExamHistory>["onChange"] = (
    pagination
  ) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListExamHistory();
  };

  const handleViewDetail = (record: IGetListExamHistory) => {
    navigate("/exam-history-detail", {
      state: {
        exam_date: record.exam_date,
        user_id: studentId,
        exam_code: record.exam_code,
        part_number: record.part_number,
        exam_name: record.exam_name,
        score: record.score,
      },
    });
  };

  const columns: TableProps<IGetListExamHistory>["columns"] = [
    {
      title: "Ngày thi",
      dataIndex: "exam_date",
      key: "exam_date",
      align: "center",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tên bài thi",
      dataIndex: "exam_name",
      key: "exam_name",
      align: "center",
    },
    {
      title: "Mã bài thi",
      dataIndex: "exam_code",
      key: "exam_code",
      align: "center",
    },
    {
      title: "Phần thi",
      dataIndex: "part_number",
      key: "part_number",
      align: "center",
    },
    {
      title: "Loại bài thi",
      dataIndex: "exam_type",
      key: "exam_type",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        switch (status) {
          case "DONE":
            return "Hoàn thành";
          default:
            return status;
        }
      },
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_, record) => (
        <Space size="middle">
          <Button size="middle" onClick={() => handleViewDetail(record)}>
            <TiDocumentText />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Lịch sử làm bài thi"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Table
        columns={columns}
        dataSource={examHistory}
        rowKey="id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        onChange={onChangeTable}
      />
    </Modal>
  );
};

export default ExamHistoryModal;
