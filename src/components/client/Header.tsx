import { editStudent } from "@/api/admin/api-students/edit-student.api";
import { useAuth } from "@/hooks/use-auth.hook";
import { clearAccessToken } from "@/services/auth";
import { showToast } from "@/services/toast";
import {
  ContactsOutlined,
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const pathname = useLocation();
  const navigate = useNavigate();
  const { userInfo, syncDataWithServer } = useAuth();

  const handleLogout = () => {
    clearAccessToken();
    navigate("/auth/login");
  };

  const showModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      fullName: userInfo?.fullName,
      dob: userInfo?.dob ? dayjs(userInfo.dob) : null,
      gender: userInfo?.gender,
      email: userInfo?.email,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!userInfo?.id) {
        showToast({ type: "error", content: "Không tìm thấy ID người dùng" });
        return;
      }

      const editStudentSub = editStudent(
        {
          name: values.fullName,
          dob: values.dob.format("YYYY-MM-DD"),
          gender: values.gender,
          email: values.email,
          phone: values.phone,
          address: values.address,
        },
        userInfo.id
      ).subscribe({
        next: () => {
          showToast({
            type: "success",
            content: "Cập nhật thông tin thành công",
          });
          setIsEditing(false);
          if (syncDataWithServer) {
            syncDataWithServer();
          }
        },
        error: (error) => {
          console.error("Lỗi khi cập nhật thông tin:", error);
          showToast({ type: "error", content: "Cập nhật thông tin thất bại" });
        },
      });

      editStudentSub.add();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      showToast({
        type: "error",
        content: "Có lỗi xảy ra khi kết nối với máy chủ",
      });
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={showModal}>
          <ContactsOutlined className="mr-2" />
          Thông tin tài khoản
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/exam-history" className="text-inherit">
          <HistoryOutlined className="mr-2" />
          Lịch sử làm bài
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={handleLogout}>
          <LogoutOutlined className="mr-2" />
          Logout
        </div>
      ),
    },
  ];
  return (
    <header className="bg-white shadow p-4">
      <div className="no-underline flex justify-between ">
        <div className="text-lg font-bold flex items-center">
          Master English Center
        </div>
        <div className="flex space-x-14 items-center">
          <Link
            to="/"
            className={`font-bold text-gray-700 no-underline hover:text-blue-500 ${
              pathname.pathname === "/" ? "!text-blue-500 " : ""
            }`}
          >
            Thi thử Full Test
          </Link>
          <Link
            to="/practice"
            className={`font-bold text-gray-700 no-underline hover:text-blue-500 ${
              pathname.pathname.includes("/practice") ? "!text-blue-500" : ""
            }`}
          >
            Luyện tập Part
          </Link>
        </div>
        <div className="flex items-center mr-4">
          <Dropdown menu={{ items }} placement="bottomLeft">
            <a
              style={{ color: "#000000", fontWeight: "bold" }}
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                {userInfo?.username}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <Modal
        title="Thông tin tài khoản"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          isEditing
            ? null
            : [
                <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>,
              ]
        }
      >
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              fullName: userInfo?.fullName,
              dob: userInfo?.dob ? dayjs(userInfo.dob) : null,
              gender: userInfo?.gender,
              email: userInfo?.email,
              phone: userInfo?.phone,
              address: userInfo?.address,
            }}
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              name="dob"
              label="Ngày sinh"
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} disabled/>
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
            >
              <Select disabled>
                <Select.Option value="MALE">Nam</Select.Option>
                <Select.Option value="FEMALE">Nữ</Select.Option>
                <Select.Option value="OTHER">Khác</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button onClick={() => setIsEditing(false)} className="mr-2">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <p>
              <strong>Tên người dùng:</strong> {userInfo?.username}
            </p>
            <p>
              <strong>Tên đầy đủ:</strong> {userInfo?.fullName}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {userInfo?.dob}
            </p>
            <p>
              <strong>Giới tính:</strong> {userInfo?.gender}
            </p>
            <p>
              <strong>Email:</strong> {userInfo?.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userInfo?.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {userInfo?.address}
            </p>
          </>
        )}
      </Modal>
    </header>
  );
};

export default Header;
