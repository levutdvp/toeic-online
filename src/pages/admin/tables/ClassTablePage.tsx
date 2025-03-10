import { deleteClass } from "@/api/api-classes/delete-class.api";
import {
  getClassesList,
  IGetListClasses,
} from "@/api/api-classes/get-list-class.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { TableQueriesRef } from "@/types/pagination.type";
import { Button, Modal, Space, Table, TableProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import ActionBlockClasses from "./classes/action-block-class";
import AddClass from "./classes/add";

interface DataType {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
}

type TableQueries = TableQueriesRef<DataType>;

const ClassTablesPage = () => {
  const [dataClasses, setDataClasses] = useState<IGetListClasses[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
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
    onChange: (_: any, selectedRowKeys: DataType[]) => {
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
        showToast({ type: "success", content: "Delete successful!" });
        setSelectedRowKeys([]);
        getListClasses();
      },
      error: () => {
        showToast({ type: "error", content: "Delete failed!" });
      },
      complete: () => {
        removeLoading();
        setIsModalOpen(false);
        setSelectedClassId(null);
      },
    });
    deleteSub.add();
  }, [selectedClassId]);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
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

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Class Name",
      dataIndex: "class_type",
      key: "class_type",
      align: "center",
    },
    {
      title: "Class Code",
      dataIndex: "class_code",
      key: "class_code",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      align: "center",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      align: "center",
    },
    {
      title: "Schedule",
      dataIndex: "days",
      key: "days",
      align: "center",
    },
    {
      title: "Number of Students",
      dataIndex: "number_of_students",
      key: "number_of_students",
      align: "center",
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      align: "center",
    },
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
      <ActionBlockClasses
        onClickAction={onClickAction}
        selectedRows={selectedRowKeys}
        getListData={getListClasses}
      />
      <Table<DataType>
        columns={columns}
        dataSource={dataClasses}
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

      <AddClass isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </>
  );
};

export default ClassTablesPage;
