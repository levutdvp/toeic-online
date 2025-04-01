import { addStudent } from "@/api/admin/api-students/add-student.api";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Modal, Select } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IAddForm } from "./form.config";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/api-students/get-list-studentInfo.api";
import { TableQueriesRef } from "@/types/pagination.type";
import { initPaging } from "@/consts/paging.const";

interface addStudentProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
}

type TableQueries = TableQueriesRef<IGetListStudents>;
const AddStudentDetailClass: React.FC<addStudentProps> = ({
  classId,
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [dataStudents, setDataStudents] = useState<IGetListStudents[]>([]);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  console.log(dataStudents);

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

  const handleAddSubmit = (values: IAddForm) => {
    const selectedStudent = dataStudents.find(
      (student) => student.name === values.name
    );

    if (!selectedStudent) {
      showToast({ content: "Không tìm thấy học sinh", type: "error" });
      return;
    }
    const params = {
      class_id: classId,
      name: selectedStudent.name,
      dob:
        selectedStudent.dob && dayjs(selectedStudent.dob).format("YYYY-MM-DD"),
      gender: selectedStudent.gender,
      phone: selectedStudent.phone,
      email: selectedStudent.email,
      address: selectedStudent.address,
    };

    showLoading();
    const addStudents = addStudent(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm mới học sinh thành công" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    addStudents.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Thêm mới học sinh"}
        open={isOpen}
        onOk={form.submit}
        onCancel={handleClose}
        footer={[
          <Button
            style={{ marginTop: "50px" }}
            key="Submit"
            type="primary"
            onClick={form.submit}
          >
            Thêm
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: "30px" }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="name"
              label="Chọn học sinh"
              rules={[{ required: true, message: "Vui lòng chọn học sinh" }]}
            >
              <Select
                options={dataStudents.map((student) => ({
                  value: student.name,
                  label: student.name,
                }))}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddStudentDetailClass;
