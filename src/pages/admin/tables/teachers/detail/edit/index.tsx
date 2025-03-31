import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { convertToInteger } from "@/utils/map.util";
import { editCertificate } from "@/api/admin/api-teachers/detail-teacher/edit-certificate.api";
import { ICertificate } from "@/api/admin/api-teachers/get-list-teacherInfo.api";

interface editCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: ICertificate;
}
const EditCertificate: React.FC<editCertificateProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();
  const { teacherId } = useParams<{ teacherId: string }>();

  const initialValues = useMemo(() => {
    if (!recordSelected) return {};

    return {
      certificate_name: recordSelected.certificate_name,
      score: convertToInteger(recordSelected.score),
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    if (!teacherId) {
      return;
    }

    const params = {
      user_id: teacherId,
      certificate_name: values.certificate_name,
      score: values.score,
    };

    showLoading();
    const editCertificates = editCertificate(params, teacherId).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Cập nhật thành công!" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    editCertificates.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Cập nhật thông tin bằng cấp"}
        open={isOpen}
        onOk={form.submit}
        onCancel={handleClose}
        footer={[
          <Button key="Submit" type="primary" onClick={form.submit}>
            Cập nhật
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 100 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
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

export default EditCertificate;
