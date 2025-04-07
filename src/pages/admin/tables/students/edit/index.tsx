import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { IGetListStudents } from "@/api/admin/api-students/get-list-studentInfo.api";
import { editStudent } from "@/api/admin/api-students/edit-student.api";

interface editStudentProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IGetListStudents;
}
const EditStudent: React.FC<editStudentProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      name: recordSelected.name,
      dob: recordSelected.dob ? dayjs(recordSelected.dob) : null,
      gender: recordSelected.gender,
      phone: recordSelected.phone,
      email: recordSelected.email,
      address: recordSelected.address,
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    const params = {
      name: values.name,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      address: values.address,
    };

    showLoading();
    if (recordSelected?.id === undefined) {
      return {};
    }
    const editStudents = editStudent(params, recordSelected.id).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Cập nhật thành công!" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    editStudents.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Cập nhật thông tin học viên"}
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
            Cập nhật
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 450 }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
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

export default EditStudent;
