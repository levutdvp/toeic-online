import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, Modal } from "antd";
import { IAddForm } from "./form.config";
import React from "react";
import { addClass } from "@/api/api-classes/create-class.api";
// import { validateForm } from './form.config';

interface addClassProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddClass: React.FC<addClassProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      class_code: values.class_code,
      class_type: values.class_type,
      start_date: values.start_date,
      end_date: values.end_date,
      start_time: values.start_time,
      end_time: values.end_time,
      days: values.days,
      number_of_students: values.number_of_students,
      teacher: values.teacher,
    };

    showLoading();
    const addClasses = addClass(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Add class successful" });
        form.resetFields();
      },
      error: () => removeLoading(),
    });

    addClasses.add();
  };

  return (
    <>
      <Modal
        title={"Add class"}
        open={isOpen}
        onOk={form.submit}
        onCancel={onClose}
        footer={[
          <Button key="Submit" type="primary" onClick={form.submit}>
            Add
          </Button>,
          <Button key="Cancel" onClick={onClose}>
            Cancel
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 150 }}
      >
        <div className="mt-20">
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            form={form}
            onFinish={handleAddSubmit}
          >
            <Input
              name="fullName"
              placeholder="Please input full name"
              className="mb-5"
            />
            <Input
              className="mt-5"
              name="email"
              placeholder="Please input email"
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddClass;
