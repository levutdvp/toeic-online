import { useCallback } from "react";
import { Input, Button, Form, Switch, InputNumber } from "antd";
import { removeLoading, showLoading } from "@/services/loading";
import { addExam, ICreateExam } from "@/api/admin/api-exam/create-exam.api";
import { showToast } from "@/services/toast";

const CreateExamForm = () => {
  const [form] = Form.useForm();
  const onFinish = useCallback(
    (values: ICreateExam) => {
      showLoading();
      const addExamSub = addExam(values).subscribe({
        next: () => {
          showToast({ type: "success", content: "Tạo bài thi thành công" });
          removeLoading();
          form.resetFields();
        },
        error: () => {
          showToast({ type: "error", content: "Tạo bài thi thất bại" });
          removeLoading();
        },
      });
      addExamSub.add();
    },
    [form]
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tạo Đề Thi</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="exam_code"
          label="Mã đề thi"
          rules={[{ required: true, message: "Vui lòng nhập mã đề thi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="exam_name"
          label="Tên đề thi"
          rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="section_name"
          label="Tên phần thi"
          rules={[{ required: true, message: "Vui lòng nhập tên phần thi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="part_number"
          label="Phần thi"
          rules={[{ required: true, message: "Vui lòng nhập phần thi" }]}
        >
          <InputNumber min={1} max={7} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="question_count"
          label="Số câu hỏi"
          rules={[{ required: true, message: "Vui lòng nhập số câu hỏi" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="year"
          label="Năm"
          rules={[{ required: true, message: "Vui lòng nhập năm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Thời gian (phút)"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian làm bài" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="max_score"
          label="Điểm tối đa"
          rules={[{ required: true, message: "Vui lòng nhập điểm tối đa" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại đề thi"
          rules={[{ required: true, message: "Vui lòng chọn loại đề thi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="is_Free" label="Miễn phí" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Tạo đề thi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateExamForm;
