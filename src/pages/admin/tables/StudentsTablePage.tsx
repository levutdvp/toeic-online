import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/get-list-studentInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { Button, message, Modal, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { initPaging } from "@/consts/paging.const";
import { TableQueriesRef } from "@/types/pagination.type";
import { deleteStudent } from "@/api/admin/delete-student.api";

interface DataType {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

type TableQueries = TableQueriesRef<DataType>;

const StudentTablesPage = () => {
  const [dataStudents, setDataStudents] = useState<IGetListStudents[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListStudents = useCallback(() => {
    setLoading(true);
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
    setLoading(false);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as number[]);
    },
  };

  const deleteStudents = useCallback((ids: number[]) => {
    console.log(ids.length);
    if (ids.length === 0) {
      message.warning("Please select student to delete");
      return;
    }

    Modal.confirm({
      title: "Confirm delete",
      content: `Are you sure you want to delete?`,
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        showLoading();
        const deleteSub = deleteStudent({ ids }).subscribe({
          next: () => {
            message.success("Xóa sinh viên thành công!");
            setSelectedRowKeys([]);
            getListStudents();
          },
          error: () => {
            message.error("Xóa thất bại, vui lòng thử lại.");
          },
          complete: () => {
            removeLoading();
          },
        });
        deleteSub.add();
      },
    });
  }, []);

  const onChangeTable: TableProps<DataType>["onChange"] = (pagination) => {
    tableQueriesRef.current = {
      ...tableQueriesRef.current,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? initPaging.pageSize,
    };
    getListStudents();
    setLoading(false);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      width: 200,
      align: "center",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 200,
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: 250,
      align: "center",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      width: 300,
      align: "center",
    },
    { title: "Address", dataIndex: "address", key: "address", align: "center" },
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
            onClick={() => deleteStudents([record.id])}
          >
            <MdOutlineDeleteForever />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={dataStudents}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          position: ["bottomCenter"],
          pageSize: tableQueriesRef.current.pageSize,
          current: tableQueriesRef.current.current,
          total: tableQueriesRef.current.total,
        }}
        loading={loading}
        onChange={onChangeTable}
      />
    </>
  );
};

export default StudentTablesPage;
