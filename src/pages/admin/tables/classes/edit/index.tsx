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
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { IEditForm, validateForm } from "./form.config";
import { editClass } from "@/api/admin/api-classes/edit-class.api";
import { IGetListClasses } from "@/api/admin/api-classes/get-list-class.api";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";

interface editClassProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IGetListClasses;
}
const EditClass: React.FC<editClassProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
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

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      class_code: recordSelected.class_code,
      class_type: recordSelected.class_type,
      start_date: recordSelected.start_date && dayjs(recordSelected.start_date),
      end_date: recordSelected.end_date && dayjs(recordSelected.end_date),
      start_time:
        recordSelected.start_time && dayjs(recordSelected.start_time, "HH:mm"),
      end_time:
        recordSelected.end_time && dayjs(recordSelected.end_time, "HH:mm"),
      days:
        recordSelected.days &&
        recordSelected.days.map((day: string) => dayjs(day, "yyyy-MM-dd")),
      number_of_students: recordSelected.number_of_students,
      teacher: recordSelected.teacher,
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    const params = {
      class_code: values.class_code,
      class_type: values.class_type,
      start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
      start_time: dayjs(values.start_time).format("HH:mm"),
      end_time: dayjs(values.end_time).format("HH:mm"),
      days: values.days.map((day: string) => dayjs(day).format("DD-MM-YYYY")),
      number_of_students: values.number_of_students,
      teacher: values.teacher,
    };

    showLoading();
    if (recordSelected?.id === undefined) {
      return {};
    }
    const editStudents = editClass(params, recordSelected.id).subscribe({
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
        title={"Cập nhật thông tin lớp học"}
        open={isOpen}
        onOk={form.submit}
        onCancel={handleClose}
        footer={[
          <Button key="Submit" type="primary" onClick={form.submit}>
            Cập nhật
          </Button>,
          <Button key="Cancel" onClick={onClose}>
            Hủy bỏ
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 500 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
            <Form.Item name="class_code" rules={validateForm.class_code}>
              <Input placeholder="Tên lớp học" />
            </Form.Item>
            <Form.Item name="class_type" rules={validateForm.class_type}>
              <Input placeholder="Mã lớp học" />
            </Form.Item>
            <Form.Item name="start_date" rules={validateForm.start_date}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Ngày bắt đầu"
              />
            </Form.Item>
            <Form.Item name="end_date" rules={validateForm.end_date}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Ngày kết thúc"
              />
            </Form.Item>
            <Form.Item name="start_time" rules={validateForm.start_time}>
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                placeholder="Thời gian bắt đầu"
              />
            </Form.Item>
            <Form.Item name="end_time" rules={validateForm.end_time}>
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                placeholder="Thời gian bắt đầu"
              />
            </Form.Item>
            <Form.Item name="days" rules={validateForm.days}>
              <DatePicker
                format={"DD-MM-YYYY"}
                style={{ width: "100%" }}
                placeholder="Lịch học"
                multiple
              />
            </Form.Item>
            <Form.Item
              name="number_of_students"
              rules={validateForm.number_of_students}
            >
              <Input placeholder="Số lượng học viên" />
            </Form.Item>
            <Form.Item name="teacher" rules={validateForm.teacher}>
              <Select placeholder="Giáo viên phụ trách" allowClear>
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

export default EditClass;
