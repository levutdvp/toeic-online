import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, InputNumber, Modal } from "antd";
import { IAddForm, validateForm } from "./form.config";
import React from "react";
import { addCertificate } from "@/api/admin/api-teachers/detail-teacher/add-certificate.api";
import dayjs from "dayjs";

interface addTeacherProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  getTeacherCertificates: () => void;
}
const AddCertificate: React.FC<addTeacherProps> = ({
  isOpen,
  onClose,
  teacherId,
  getTeacherCertificates,
}) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    if (!teacherId) {
      return;
    }

    const params = {
      user_id: teacherId.toString(),
      certificate_name: values.certificate_name,
      score: values.score,
      issued_by: values.issued_by,
      issue_date: dayjs(values.issue_date).format("YYYY-MM-DD"),
      expiry_date: dayjs(values.expiry_date).format("YYYY-MM-DD"),
    };

    showLoading();
    const addCertificates = addCertificate(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm chứng chỉ thành công" });
        form.resetFields();
        onClose();
        getTeacherCertificates();
      },
      error: () => removeLoading(),
    });

    addCertificates.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Thêm mới chứng chỉ"}
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
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="certificate_name"
              rules={validateForm.certificate_name}
              label="Tên chứng chỉ"
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="score"
              rules={validateForm.score}
              label="Điểm"
              required
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="issued_by"
              rules={validateForm.issued_by}
              label="Tên tổ chức cấp bằng"
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="issue_date"
              rules={validateForm.issue_date}
              label="Ngày cấp bằng"
              required
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              name="expiry_date"
              rules={validateForm.expiry_date}
              label="Ngày hết hạn"
              required
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddCertificate;
