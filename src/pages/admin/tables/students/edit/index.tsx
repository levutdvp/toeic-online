import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { IEditForm, validateForm } from "./form.config";
import React, { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { IGetListStudents } from "@/api/admin/api-students/get-list-studentInfo.api";
import { editStudent } from "@/api/admin/api-students/edit-student.api";

interface editStudentProps {
  isOpen: boolean;
  onClose: () => void;
  recordSelected?: IGetListStudents;
}
const EditStudent: React.FC<editStudentProps> = ({
  isOpen,
  onClose,
  recordSelected,
}) => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    if (!recordSelected) return;

    return {
      name: recordSelected.name,
      dob: recordSelected.dob ? dayjs(recordSelected.dob) : null,
      gender: recordSelected.gender,
      phoneNumber: recordSelected.phone,
      email: recordSelected.email,
      address: recordSelected.address,
    };
  }, [recordSelected]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleEditSubmit = (values: IEditForm) => {
    const params = {
      name: values.name,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
    };

    showLoading();
    if (recordSelected?.id === undefined) {
      return {};
    }
    const editStudents = editStudent(params, recordSelected.id).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: "Edit successful" });
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
        title={"Edit"}
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
            Edit
          </Button>,
          <Button key="Cancel" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 270 }}
      >
        <div className="mt-5">
          <Form layout="horizontal" form={form} onFinish={handleEditSubmit}>
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

export default EditStudent;
