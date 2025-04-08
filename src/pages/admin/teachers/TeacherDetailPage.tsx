import { uploadFile } from "@/api/admin/api-exam/upload-file.api";
import { deleteCertificate } from "@/api/admin/api-teachers/detail-teacher/delete-certificate.api";
import {
  getCertificateList,
  IGetListCertificate,
} from "@/api/admin/api-teachers/detail-teacher/get-list-certificate.api";
import { uploadAvatarRoleTeacher } from "@/api/admin/api-teachers/detail-teacher/upload-avatar-teacher.api";
import { uploadAvatarRoleAdmin } from "@/api/admin/api-teachers/detail-teacher/upload-avatart-admin.api";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { useAuth } from "@/hooks/use-auth.hook";
import AddCertificate from "@/pages/admin/tables/teachers/detail/add";
import EditCertificate from "@/pages/admin/tables/teachers/detail/edit";
import EditTeacherInfo from "@/pages/admin/tables/teachers/detail/edit-teacher-info";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { convertToInteger, formatGender } from "@/utils/map.util";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const TeacherDetailPage = () => {
  const { id } = useParams();
  const { userRoles } = useAuth();
  const [teacher, setTeacher] = useState<IGetListTeachers | null>(null);
  const [certificates, setCertificates] = useState<IGetListCertificate[]>([]);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditTeacherInfoModalOpen, setIsEditTeacherInfoModalOpen] =
    useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListCertificate>({
    id: undefined,
    certificate_name: "",
    score: "",
    issued_by: "",
    issue_date: "",
    expiry_date: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTeacherDetail = () => {
    if (id) {
      showLoading();
      getTeachersList({
        pageNumber: 1,
        pageSize: 100,
      }).subscribe({
        next: (res) => {
          const foundTeacher = res.data.find((t) => t.id === Number(id));
          if (foundTeacher) {
            setTeacher(foundTeacher);
          }
          removeLoading();
        },
        error: () => {
          removeLoading();
        },
      });
    }
  };

  const getTeacherCertificates = () => {
    if (id) {
      showLoading();
      getCertificateList(id).subscribe({
        next: (res) => {
          setCertificates(res.data);
          removeLoading();
        },
        error: () => {
          showToast({
            type: "error",
            content: "Lấy danh sách chứng chỉ thất bại!",
          });
          removeLoading();
        },
      });
    }
  };

  useEffect(() => {
    getTeacherDetail();
    getTeacherCertificates();
  }, [id]);

  const columns: ColumnsType<IGetListCertificate> = [
    {
      title: "Tên chứng chỉ",
      dataIndex: "certificate_name",
      key: "certificate_name",
      align: "center" as const,
    },
    {
      title: "Điểm",
      align: "center" as const,
      dataIndex: "score",
      key: "score",
      render: (score: string) => convertToInteger(score),
    },
    {
      title: "Cấp bởi",
      align: "center" as const,
      dataIndex: "issued_by",
      key: "issued_by",
      render: (issuedBy: string) => {
        return <p>{issuedBy ?? "-"}</p>;
      },
    },
    {
      title: "Ngày cấp",
      align: "center" as const,
      dataIndex: "issue_date",
      key: "issue_date",
      render: (issuedDate: string) => {
        return <p>{dayjs(issuedDate).format("DD-MM-YYYY") ?? "-"}</p>;
      },
    },
    {
      title: "Ngày hết hạn",
      align: "center" as const,
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (expiredDate: string) => {
        return <p>{dayjs(expiredDate).format("DD-MM-YYYY") ?? "-"}</p>;
      },
    },
    {
      title: "Sửa",
      key: "edit",
      align: "center" as const,
      render: (_: any, record: IGetListCertificate) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleOpenEditModal(record)}
        />
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      align: "center" as const,
      render: (_: any, record: IGetListCertificate) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteClick(record)}
        />
      ),
    },
  ];

  const handleAddCertificate = () => {
    setOpenModalAdd(true);
  };

  const handleCloseAddCertificate = () => {
    setOpenModalAdd(false);
    getTeacherCertificates();
  };

  const handleOpenEditModal = (record: IGetListCertificate) => {
    setRecordSelected({
      id: record.id || undefined,
      certificate_name: record.certificate_name || "",
      score: record.score || "",
      issued_by: record.issued_by || "",
      issue_date: dayjs(record.issue_date).format("YYYY-MM-DD") || "",
      expiry_date: dayjs(record.expiry_date).format("YYYY-MM-DD") || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getTeacherCertificates();
  };

  const handleDeleteClick = (record: IGetListCertificate) => {
    setRecordSelected(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCertificate = () => {
    if (recordSelected && recordSelected.id) {
      showLoading();
      deleteCertificate([recordSelected.id]).subscribe({
        next: () => {
          showToast({ type: "success", content: "Xóa thành công!" });
          setIsDeleteModalOpen(false);
          getTeacherCertificates();
        },
        error: () => {
          showToast({ type: "error", content: "Xóa thất bại!" });
          setIsDeleteModalOpen(false);
          removeLoading();
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setUploading(true);

    try {
      const res: any = await uploadFile({ imageFile: file });

      if (res.image_url) {
        const isAdmin = userRoles.includes("ADMIN");
        const uploadAvatar = isAdmin
          ? uploadAvatarRoleAdmin
          : uploadAvatarRoleTeacher;

        uploadAvatar({
          id: Number(id),
          image_link: res.image_url,
        }).subscribe({
          next: () => {
            showToast({
              type: "success",
              content: "Cập nhật ảnh đại diện thành công!",
            });
            getTeacherDetail();
          },
          error: () => {
            showToast({
              type: "error",
              content: "Cập nhật ảnh đại diện thất bại!",
            });
          },
          complete: () => {
            setUploading(false);
          },
        });
      } else {
        showToast({ type: "error", content: "Tải ảnh lên thất bại!" });
        setUploading(false);
      }
    } catch (error) {
      console.error(error);
      showToast({ type: "error", content: "Đã xảy ra lỗi!" });
      setUploading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <div className="flex items-center space-x-10 gap-8">
            <div
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {uploading ? (
                <div className="flex items-center justify-center w-[100px] h-[100px] border rounded-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <Avatar src={teacher.avatar} size={100} className="border" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <UploadOutlined className="text-white text-2xl" />
                  </div>
                </>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{teacher.name}</h2>
              <p>
                <strong>Mã giáo viên:</strong> {teacher.id}
              </p>
              <p>
                <strong>Giới tính:</strong> {formatGender(teacher.gender || "")}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{" "}
                {dayjs(teacher.dob).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Thông tin liên hệ</h3>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditTeacherInfoModalOpen(true)}
              >
                Sửa thông tin
              </Button>
            </div>
            <div className="flex gap-24">
              <div className="flex flex-col gap-2">
                <p className="mb-2">
                  <strong>Số điện thoại:</strong> {teacher.phone}
                </p>
                <p className="mb-2">
                  <strong>Địa chỉ:</strong> {teacher.address}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {teacher.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-bold text-lg">Chứng chỉ</h3>
            <Table
              dataSource={certificates}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
            <Button
              icon={<PlusOutlined />}
              className="mt-2"
              onClick={handleAddCertificate}
            >
              Thêm chứng chỉ
            </Button>
          </div>
        </Card>
      </Space>

      <AddCertificate
        isOpen={openModalAdd}
        onClose={handleCloseAddCertificate}
        teacherId={Number(id)}
        getTeacherCertificates={getTeacherCertificates}
      />

      <EditCertificate
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        recordSelected={recordSelected}
        getTeacherCertificates={getTeacherCertificates}
      />

      <EditTeacherInfo
        isOpen={isEditTeacherInfoModalOpen}
        onClose={() => setIsEditTeacherInfoModalOpen(false)}
        teacher={teacher}
        getTeacherDetail={getTeacherDetail}
      />

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDeleteCertificate}
        onCancel={handleCancelDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa?</p>
      </Modal>
    </div>
  );
};

export default TeacherDetailPage;
