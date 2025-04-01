import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IAddForm, validateForm } from "./form.config";
import React from "react";
import { addTeacher } from "@/api/admin/api-teachers/add-teacher.api";
import dayjs from "dayjs";

interface addTeacherProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddTeacher: React.FC<addTeacherProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      name: values.name,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      address: values.address,
      certificates: values.certificates
        ? values.certificates
            .map((cert) => cert.trim())
            .filter((cert) => cert !== "")
        : [],
    };

    showLoading();
    const addTeachers = addTeacher(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm giáo viên thành công" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    addTeachers.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Thêm mới giáo viên"}
        open={isOpen}
        onOk={form.submit}
        onCancel={handleClose}
        footer={[
          <Button key="Submit" type="primary" onClick={form.submit}>
            Thêm
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 500 }}
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
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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
            {/* <Form.Item name="certificates" rules={validateForm.certificates}>
              <Input
                placeholder="Bằng cấp"
                onChange={(e) => {
                  form.setFieldsValue({
                    certificates: e.target.value.split(","),
                  });
                }}
              />
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddTeacher;
