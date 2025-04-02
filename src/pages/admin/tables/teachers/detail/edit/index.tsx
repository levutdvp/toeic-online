import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, InputNumber, Modal } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import { convertToInteger } from "@/utils/map.util";
import { editCertificate } from "@/api/admin/api-teachers/detail-teacher/edit-certificate.api";
import { ICertificate } from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import dayjs from "dayjs";

interface editCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: ICertificate;
  getTeacherCertificates: () => void;
}
const EditCertificate: React.FC<editCertificateProps> = ({
  isOpen,
  onClose,
  recordSelected,
  getTeacherCertificates,
}) => {
  const [form] = Form.useForm();

  console.log(recordSelected);

  const initialValues = useMemo(() => {
    if (!recordSelected) return {};

    return {
      certificate_name: recordSelected.certificate_name,
      score: convertToInteger(recordSelected.score),
      issued_by: recordSelected.issued_by,
      issue_date: dayjs(recordSelected.issue_date),
      expiry_date: dayjs(recordSelected.expiry_date),
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    if (!recordSelected?.id) {
      return;
    }

    const params = {
      certificate_name: values.certificate_name,
      score: values.score,
      issued_by: values.issued_by,
      issue_date: dayjs(values.issue_date).format("YYYY-MM-DD"),
      expiry_date: dayjs(values.expiry_date).format("YYYY-MM-DD"),
    };

    showLoading();
    const editCertificates = editCertificate(
      params,
      recordSelected.id.toString()
    ).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Cập nhật thành công!" });
        form.resetFields();
        onClose();
        getTeacherCertificates();
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
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
            <Form.Item
              name="certificate_name"
              rules={validateForm.certificate_name}
              label="Tên bằng cấp"
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

export default EditCertificate;
