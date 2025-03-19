import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Form, Input, Modal, Select } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import { editUser } from "@/api/admin/api-users/edit.user.api";
import { IGetListUsers } from "@/api/admin/api-users/get-list-userInfo.api";

interface editUserProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IGetListUsers;
}
const EditUser: React.FC<editUserProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      name: recordSelected.username,
      email: recordSelected.email,
      role: recordSelected.role,
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    const params = {
      username: values.username,
      email: values.email,
      role: values.role,
    };

    showLoading();
    const editUsers = editUser(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Cập nhật thành công!" });
        form.resetFields();
        onClose();
      },
      error: () => removeLoading(),
    });

    editUsers.add();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      <Modal
        title={"Cập nhật thông tin người dùng"}
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
        bodyStyle={{ height: 110 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
            <Form.Item name="name" rules={validateForm.username}>
              <Input placeholder="Tên người dùng" />
            </Form.Item>

            <Form.Item name="email" rules={validateForm.email}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="role" rules={validateForm.role}>
              <Select
                placeholder="Quyền"
                options={[
                  { value: "STUDENT", label: "Học sinh" },
                  { value: "TEACHER", label: "Giáo viên" },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditUser;
