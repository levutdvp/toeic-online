import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import { IAddForm, validateForm } from "./form.config";
import React from "react";
import { addExam } from "@/api/admin/api-exam/create-exam.api";

interface addExamsProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddExam: React.FC<addExamsProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      exam_code: values.exam_code,
      exam_name: values.exam_name,
      duration: values.duration,
      part_number: values.part_number,
      section_name: values.section_name,
      question_count: values.question_count,
      max_score: values.max_score,
      type: values.type,
      is_Free: false,
    };

    showLoading();
    const addExams = addExam(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm mới bài thi thành công" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    addExams.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Thêm mới đề thi"}
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
            Thêm
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 700 }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="exam_code"
              rules={validateForm.exam_code}
              label="Mã đề thi"
              required
            >
              <Input />
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
              <Select>
                <Select.Option value="Listening">Listening</Select.Option>
                <Select.Option value="Reading">Reading</Select.Option>
                <Select.Option value="Full">Full</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="part_number"
              rules={validateForm.part_number}
              label="Phần thi"
              required
            >
              <InputNumber min={0} max={7} style={{ width: "100%" }} />
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

export default AddExam;
