import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { editStudent } from "@/api/admin/api-students/edit-student.api";
import { IStudentRes } from "@/api/admin/api-classes/get-list-detail-class.api";

interface editStudentProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IStudentRes;
}
const EditStudentDetailClass: React.FC<editStudentProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      name: recordSelected.full_name,
      birth: recordSelected.birth_date ? dayjs(recordSelected.birth_date) : null,
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
        title={"Cập nhật thông tin học sinh"}
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
        bodyStyle={{ height: 270 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
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

export default EditStudentDetailClass;
