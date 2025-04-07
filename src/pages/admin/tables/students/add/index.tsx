import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IAddForm, validateForm } from "./form.config";
import { addStudent } from "@/api/admin/api-students/add-student.api";
import React from "react";
import dayjs from "dayjs";

interface addStudentProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddStudent: React.FC<addStudentProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      name: values.name,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      address: values.address,
    };

    showLoading();
    const addStudents = addStudent(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm mới học viên thành công" });
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
        title={"Thêm mới học viên"}
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
        bodyStyle={{ height: 450 }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="name"
              rules={validateForm.name}
              label="Họ và tên"
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dob"
              rules={validateForm.dob}
              label="Ngày sinh"
              required
            >
              <DatePicker style={{ width: "100%" }} format={"DD-MM-YYYY"} />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={validateForm.gender}
              label="Giới tính"
              required
            >
              <Select
                options={[
                  { value: "MALE", label: "Nam" },
                  { value: "FEMALE", label: "Nữ" },
                  { value: "OTHER", label: "Khác" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={validateForm.phone}
              label="Số điện thoại"
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              rules={validateForm.email}
              label="Email"
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              rules={validateForm.address}
              label="Địa chỉ"
              required
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddStudent;
