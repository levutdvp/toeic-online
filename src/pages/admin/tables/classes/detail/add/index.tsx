import { addStudentToClass } from "@/api/admin/api-classes/add-student-to-class.api";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/api-students/get-list-studentInfo.api";
import { showToast } from "@/services/toast";
import { Button, Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";

interface AddStudentDetailClassProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
}

const AddStudentDetailClass = ({
  classId,
  isOpen,
  onClose,
}: AddStudentDetailClassProps) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<IGetListStudents[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchStudents = () => {
      try {
        setLoadingStudents(true);
        const params = {
          pageNumber: 1,
          pageSize: 100,
        };

        const subscription = getStudentsList(params).subscribe({
          next: (response) => {
            setStudents(response.data || []);
            setLoadingStudents(false);
          },
          error: (error) => {
            console.error("Lỗi khi lấy danh sách học sinh:", error);
            showToast({
              type: "error",
              content: "Không thể tải danh sách học sinh",
            });
            setLoadingStudents(false);
          },
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        showToast({
          type: "error",
          content: "Không thể tải danh sách học sinh",
        });
        setLoadingStudents(false);
      }
    };

    if (isOpen) {
      const subscription = fetchStudents();
      return () => {
        if (subscription) {
          subscription();
        }
      };
    }
  }, [isOpen]);

  const handleSubmit = (values: { user_id: string }) => {
    try {
      setLoading(true);
      const subscription = addStudentToClass({
        user_id: values.user_id,
        class_id: classId.toString(),
      }).subscribe({
        next: () => {
          showToast({
            type: "success",
            content: "Thêm học sinh vào lớp thành công!",
          });
          form.resetFields();
          onClose();
          setLoading(false);
        },
        error: (error) => {
          console.error("Lỗi khi thêm học sinh:", error);
          setLoading(false);
        },
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Lỗi khi thêm học sinh:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Học Sinh Vào Lớp"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="user_id"
          label="Chọn Học Sinh"
          rules={[{ required: true, message: "Vui lòng chọn học sinh!" }]}
        >
          <Select
            placeholder="Chọn học sinh"
            loading={loadingStudents}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label?.toString().toLowerCase() || "").includes(
                input.toLowerCase()
              )
            }
            options={students.map((student) => ({
              value: student.id?.toString(),
              label: `${student.name} (${student.email})`,
            }))}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm Học Sinh
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStudentDetailClass;
