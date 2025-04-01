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
        bodyStyle={{ height: 700 }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
            <Form.Item
              name="exam_code"
              rules={validateForm.exam_code}
              label="Mã đề thi"
              required
            >
              <Input disabled/>
            </Form.Item>

            <Form.Item
              name="exam_name"
              rules={validateForm.exam_name}
              label="Tên đề thi"
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="section_name"
              rules={validateForm.section_name}
              label="Tên phần thi "
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="part_number"
              rules={validateForm.part_number}
              label="Phần thi"
              required
            >
              <InputNumber min={1} max={7} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="question_count"
              rules={validateForm.question_count}
              label="Số câu hỏi"
              required
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="duration"
              rules={validateForm.duration}
              label="Thời gian làm bài"
              required
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="max_score"
              rules={validateForm.max_score}
              label="Điểm tối đa đạt được"
              required
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="type"
              rules={validateForm.type}
              label="Loại đề thi"
              required
            >
              <Input />
            </Form.Item>
            <Form.Item name="is_Free" label="Miễn phí" valuePropName="checked">
              <Switch disabled />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditExam;
