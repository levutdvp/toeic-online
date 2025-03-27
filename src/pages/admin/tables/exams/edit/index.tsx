import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, InputNumber, Modal, Switch } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import { IGetListTest } from "@/api/client/get-list-test.api";
import { editExam } from "@/api/admin/api-exam/edit-exam.api";

interface editExamProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IGetListTest;
}
const EditExam: React.FC<editExamProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      exam_code: recordSelected.exam_code,
      exam_name: recordSelected.exam_name,
      duration: recordSelected.duration,
      part_number: recordSelected.part_number,
      section_name: recordSelected.section_name,
      question_count: recordSelected.question_count,
      max_score: recordSelected.max_score,
      type: recordSelected.type,
      is_Free: recordSelected.is_Free,
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    const params = {
      exam_code: values.exam_code,
      exam_name: values.exam_name,
      duration: values.duration,
      part_number: values.part_number,
      section_name: values.section_name,
      question_count: values.question_count,
      max_score: values.max_score,
      type: values.type,
      is_Free: values.is_Free,
    };

    showLoading();
    if (recordSelected?.id === undefined) {
      return {};
    }
    const editStudents = editExam(params, recordSelected.id).subscribe({
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
        title={"Cập nhật thông tin đề thi"}
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
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
            <Form.Item name="exam_code" rules={validateForm.exam_code}>
              <Input placeholder="Mã đề thi" disabled />
            </Form.Item>

            <Form.Item name="exam_name" rules={validateForm.exam_name}>
              <Input placeholder="Tên đề thi" />
            </Form.Item>

            <Form.Item name="section_name" rules={validateForm.section_name}>
              <Input placeholder="Tên phần thi" />
            </Form.Item>

            <Form.Item name="part_number" rules={validateForm.part_number}>
              <InputNumber
                min={1}
                max={7}
                style={{ width: "100%" }}
                placeholder="Phần thi"
              />
            </Form.Item>

            <Form.Item
              name="question_count"
              rules={validateForm.question_count}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Số câu hỏi"
              />
            </Form.Item>

            <Form.Item name="duration" rules={validateForm.duration}>
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Thời gian làm bài"
              />
            </Form.Item>

            <Form.Item name="max_score" rules={validateForm.max_score}>
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Điểm tối đa đạt được"
              />
            </Form.Item>

            <Form.Item name="type" rules={validateForm.type}>
              <Input placeholder="Loại đề thi" />
            </Form.Item>
            <Form.Item name="is_Free" label="Miễn phí" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditExam;
