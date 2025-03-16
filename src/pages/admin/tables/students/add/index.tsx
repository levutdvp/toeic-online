import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IAddForm, validateForm } from "./form.config";
import { addStudent } from "@/api/admin/api-students/add-student.api";
import React from "react";
import dayjs from "dayjs";

interface addStudentProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddStudent: React.FC<addStudentProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      name: values.name,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
    };

    showLoading();
    const addStudents = addStudent(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Add student successful" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    addStudents.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Add student"}
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
            Add
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 270 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleAddSubmit}>
            <Form.Item name="name" rules={validateForm.name}>
              <Input placeholder="Full name" />
            </Form.Item>

            <Form.Item name="dob" rules={validateForm.dob}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Date of birth"
              />
            </Form.Item>

            <Form.Item name="gender" rules={validateForm.gender}>
              <Select
                placeholder="Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
              />
            </Form.Item>

            <Form.Item name="phoneNumber" rules={validateForm.phoneNumber}>
              <Input placeholder="Phone number" />
            </Form.Item>

            <Form.Item name="email" rules={validateForm.email}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="address" rules={validateForm.address}>
              <Input placeholder="Address" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddStudent;
