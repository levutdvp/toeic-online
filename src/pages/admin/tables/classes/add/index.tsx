import { addClass } from "@/api/admin/api-classes/create-class.api";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { IAddForm, validateForm } from "./form.config";
import dayjs from "dayjs";

interface addClassProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddClass: React.FC<addClassProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState<IGetListTeachers[]>([]);

  useEffect(() => {
    if (isOpen) {
      getTeachersList({ pageNumber: 1, pageSize: 100 }).subscribe({
        next: (res) => {
          setTeachers(res.data);
        },
        error: () => {},
      });
    }
  }, [isOpen]);

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      class_code: values.class_code,
      class_type: values.class_type,
      start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
      start_time: dayjs(values.start_time).format("HH:mm"),
      end_time: dayjs(values.end_time).format("HH:mm"),
      days: values.days,
      number_of_students: values.number_of_students,
      teacher: values.teacher,
    };

    showLoading();
    const addClasses = addClass(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Thêm lớp học mới thành công!" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    addClasses.add();
  };

  const dayOptions = [
    { value: "T2", label: "Thứ 2" },
    { value: "T3", label: "Thứ 3" },
    { value: "T4", label: "Thứ 4" },
    { value: "T5", label: "Thứ 5" },
    { value: "T6", label: "Thứ 6" },
    { value: "T7", label: "Thứ 7" },
    { value: "CN", label: "Chủ nhật" },
  ];

  return (
    <>
      <Modal
        title={"Thêm mới lớp học"}
        open={isOpen}
        onOk={form.submit}
        onCancel={onClose}
        footer={[
          <Button key="Submit" type="primary" onClick={form.submit}>
            Thêm
          </Button>,
          <Button key="Cancel" onClick={onClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 760 }}
      >
        <div className="mt-5">
          <Form layout="vertical" form={form} onFinish={handleAddSubmit}>
            <Form.Item
              name="class_code"
              rules={validateForm.class_code}
              label="Tên lớp học"
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="class_type"
              rules={validateForm.class_type}
              label="Mã lớp học"
              required
            >
              <Select placeholder="Chọn mã lớp học">
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Toeic A">Toeic A</Select.Option>
                <Select.Option value="Toeic B">Toeic B</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="start_date"
              rules={validateForm.start_date}
              label="Ngày bắt đầu"
              required
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              name="end_date"
              rules={validateForm.end_date}
              label="Ngày kết thúc"
              required
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              name="start_time"
              rules={validateForm.start_time}
              label="Thời gian bắt đầu"
              required
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="end_time"
              rules={validateForm.end_time}
              label="Thời gian kết thúc"
              required
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="days"
              label="Lịch học"
              rules={[{ required: true, message: "Vui lòng chọn lịch học!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn các ngày học trong tuần"
                options={dayOptions}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="number_of_students"
              rules={validateForm.number_of_students}
              label="Số lượng học viên"
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teacher"
              rules={validateForm.teacher}
              label="Giáo viên phụ trách"
            >
              <Select allowClear>
                {teachers.map((teacher) => (
                  <Select.Option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddClass;
