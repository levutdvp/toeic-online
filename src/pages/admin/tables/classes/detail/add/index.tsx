import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IAddForm, validateForm } from "./form.config";
import { addStudent } from "@/api/admin/api-students/add-student.api";
import React from "react";
import dayjs from "dayjs";

interface addStudentProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
}
const AddStudentDetailClass: React.FC<addStudentProps> = ({
  classId,
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      class_id: classId,
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
        bodyStyle={{ height: 270 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleAddSubmit}>
            <Form.Item name="name" rules={validateForm.name}>
              <Input placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item name="dob" rules={validateForm.dob}>
              <DatePicker style={{ width: "100%" }} placeholder="Ngày sinh" />
            </Form.Item>

            <Form.Item name="gender" rules={validateForm.gender}>
              <Select
                placeholder="Giới tính"
                options={[
                  { value: "MALE", label: "Nam" },
                  { value: "FEMALE", label: "Nữ" },
                  { value: "OTHER", label: "Khác" },
                ]}
              />
            </Form.Item>

            <Form.Item name="phone" rules={validateForm.phone}>
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item name="email" rules={validateForm.email}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="address" rules={validateForm.address}>
              <Input placeholder="Địa chỉ" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddStudentDetailClass;
