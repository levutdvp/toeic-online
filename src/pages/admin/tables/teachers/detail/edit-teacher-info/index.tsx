import { editTeacherOwn } from "@/api/admin/api-teachers/edit-teacher-own.api";
import { IGetListTeachers } from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { IEditTeacherInfoForm, validateForm } from "./form.config";

interface EditTeacherInfoProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: IGetListTeachers | null;
  getTeacherDetail: () => void;
}

const EditTeacherInfo: React.FC<EditTeacherInfoProps> = ({
  isOpen,
  onClose,
  teacher,
  getTeacherDetail,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!teacher) return {};

    return {
      name: teacher.name,
      gender: teacher.gender,
      dob: dayjs(teacher.dob),
      phone: teacher.phone,
      address: teacher.address,
      email: teacher.email,
    };
  }, [teacher]);

  useEffect(() => {
    if (isOpen && teacher) {
      form.setFieldsValue(initialValues);
    }
  }, [isOpen, teacher, initialValues, form]);

  const handleEditSubmit = (values: IEditTeacherInfoForm) => {
    if (!teacher?.id) {
      return;
    }

    const params = {
      name: values.name,
      gender: values.gender,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      phone: values.phone,
      address: values.address,
      email: values.email,
    };

    showLoading();
    editTeacherOwn(params, teacher.id).subscribe({
      next: () => {
        removeLoading();
        showToast({
          type: "success",
          content: "Cập nhật thông tin thành công!",
        });
        form.resetFields();
        onClose();
        getTeacherDetail();
      },
      error: () => {
        removeLoading();
        showToast({ type: "error", content: "Cập nhật thông tin thất bại!" });
      },
    });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={isOpen}
      onOk={form.submit}
      onCancel={handleClose}
      afterClose={() => form.resetFields()}
      footer={[
        <Button key="Submit" type="primary" onClick={form.submit}>
          Cập nhật
        </Button>,
        <Button key="Cancel" onClick={handleClose}>
          Hủy bỏ
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      <div className="mt-5">
        <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
          <Form.Item name="name" rules={validateForm.name} label="Tên" required>
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={validateForm.gender}
            label="Giới tính"
            required
          >
            <Select>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
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
            name="phone"
            rules={validateForm.phone}
            label="Số điện thoại"
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
          <Form.Item
            name="email"
            rules={validateForm.email}
            label="Email"
            required
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditTeacherInfo;
