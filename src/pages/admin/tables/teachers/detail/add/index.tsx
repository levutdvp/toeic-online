import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { IAddForm, validateForm } from "./form.config";
import React from "react";
import { addCertificate } from "@/api/admin/api-teachers/detail-teacher/add-certificate.api";

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
    };

    showLoading();
    const addCertificates = addCertificate(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm bằng cấp thành công" });
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
        title={"Thêm mới bằng cấp"}
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
          <Form layout="horizontal" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="certificate_name"
              rules={validateForm.certificate_name}
            >
              <Input placeholder="Tên bằng cấp" />
            </Form.Item>
            <Form.Item name="score" rules={validateForm.score}>
              <InputNumber placeholder="Điểm" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddCertificate;
