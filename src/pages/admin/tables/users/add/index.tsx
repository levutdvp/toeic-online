import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import { IAddForm } from "./form.config";
import { addUser } from "@/api/admin/api-users/add-user.api";
import { validateForm } from "./form.config";

interface addUserProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddUser: React.FC<addUserProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      username: values.username,
      email: values.email,
      role: values.role,
    };

    showLoading();
    const addUsers = addUser(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Add users successful" });
        form.resetFields();
      },
      error: () => removeLoading(),
    });

    addUsers.add();
  };

  return (
    <>
      <Modal
        title={"Add User"}
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
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleAddSubmit}>
            <Form.Item name="username" rules={validateForm.username}>
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item name="email" rules={validateForm.email}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="role" rules={validateForm.role}>
              <Select
                placeholder="Role"
                options={[
                  { value: "STUDENT", label: "STUDENT" },
                  { value: "TEACHER", label: "TEACHER" },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddUser;
