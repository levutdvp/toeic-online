import {
  getExamHistory,
  IGetListExamHistory,
} from "@/api/common/exam-history.api";
import { initPaging } from "@/consts/paging.const";
import { useAuth } from "@/hooks/use-auth.hook";
import { removeLoading } from "@/services/loading";
import { TableQueriesRef } from "@/types/pagination.type";
import { Button, Space, Table } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { useCallback, useEffect, useRef, useState } from "react";
import { TiDocumentText } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

type TableQueries = TableQueriesRef<IGetListExamHistory>;

const ExamHistory = () => {
  const [examHistory, setExamHistory] = useState<IGetListExamHistory[]>([]);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const columns: ColumnsType<IGetListExamHistory> = [
    {
      title: "Ngày làm bài",
      dataIndex: "exam_date",
      key: "exam_date",
      align: "center",
    },
    {
      title: "Tên bài",
      dataIndex: "exam_name",
      key: "exam_name",
      align: "center",
    },
    {
      title: "Mã đề",
      dataIndex: "exam_code",
      key: "exam_code",
      align: "center",
    },
    {
      title: "Dạng bài",
      dataIndex: "exam_type",
      key: "exam_type",
      render: (text) => (text === "By Part" ? "Luyện tập Part" : "Full Test"),
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (text === "DONE" ? "Hoàn thành" : "Chưa hoàn thành"),
      align: "center",
    },
    {
      title: "Số điểm",
      dataIndex: "score",
      key: "score",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="middle"
            onClick={() =>
              navigate("/exam-history-detail", {
                state: {
                  exam_date: record.exam_date,
                  user_id: userInfo?.id,
                  exam_code: record.exam_code,
                  part_number: record.part_number,
                  exam_name: record.exam_name,
                  score: record.score,
                },
              })
            }
          >
            <TiDocumentText />
          </Button>
        </Space>
      ),
    },
  ];

  const getListExamHistory = useCallback(() => {
    const getExamHistorySub = getExamHistory(userInfo?.id ?? 0, {
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
    getExamHistorySub.add();
  }, [userInfo?.id]);

  useEffect(() => {
    if (userInfo?.id) {
      getListExamHistory();
    }
  }, [getListExamHistory, userInfo?.id]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lịch sử làm bài</h1>
      <Table
        columns={columns}
        dataSource={examHistory}
        rowKey={(record) => record.exam_date}
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        onChange={onChangeTable}
      />
    </div>
  );
};

export default ExamHistory;
