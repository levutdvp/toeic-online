import { removeLoading, showLoading } from '@/services/loading';
import { showToast } from '@/services/toast';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { IAddForm } from './form.config';
import { addUser } from '@/api/admin/api-users/add-user.api';
// import { validateForm } from './form.config';

interface addUserProps {
    isOpen: boolean;
    onClose: () => void;
}
const AddUser: React.FC<addUserProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const handleAddSubmit = (values: IAddForm) => {
    const params = {
      fullName: values.fullName,
      email: values.email,
    };

    showLoading();
    const addUsers = addUser(params).subscribe({
      next: () => {
        removeLoading();
        showToast({ content: 'Add users successful' });
        form.resetFields();
      },
      error: () => removeLoading(),
    });

    addUsers.add();
  };

  return (
    <>
      <Modal
        title={'Add User'}
        open={isOpen}
        onOk={form.submit}
        onCancel={onClose}
        footer={[
          <Button key='Submit' type='primary' onClick={form.submit}>
            Add
          </Button>,
          <Button key='Cancel' onClick={onClose}>
            Cancel
          </Button>,
        ]}
        width={500}
        bodyStyle={{ height: 150 }}
      >
        <div className='mt-20'>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout='horizontal'
            form={form}
            onFinish={handleAddSubmit}
          >
            <Input
              name='fullName'
              placeholder='Please input full name'
              className='mb-5'
            />
            <Input 
            className='mt-5'
             name='email' placeholder='Please input email'  />          
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddUser