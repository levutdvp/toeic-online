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
import { IAddForm } from "./form.config";
import React, { useEffect, useState } from "react";
import { addClass } from "@/api/admin/api-classes/create-class.api";
import { validateForm } from "./form.config";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
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
      start_date: values.start_date,
      end_date: values.end_date,
      start_time: values.start_time,
      end_time: values.end_time,
      days: values.days.map((day: string) => dayjs(day).format("YYYY-MM-DD")),
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
              <Input />
            </Form.Item>
            <Form.Item
              name="start_date"
              rules={validateForm.start_date}
              label="Ngày bắt đầu"
              required
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="end_date"
              rules={validateForm.end_date}
              label="Ngày kết thúc"
              required
            >
              <DatePicker style={{ width: "100%" }} />
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
              rules={validateForm.days}
              label="Lịch học"
              required
            >
              <DatePicker style={{ width: "100%" }} multiple />
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
