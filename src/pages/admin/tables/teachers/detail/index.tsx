import { Card, Avatar, Button, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import {
  getTeachersList,
  ICertificate,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { convertToInteger, formatGender } from "@/utils/map.util";
import { ColumnsType } from "antd/es/table";
import AddCertificate from "./add";
import EditCertificate from "./edit";
import { deleteCertificate } from "@/api/admin/api-teachers/detail-teacher/delete-certificate.api";
import { showToast } from "@/services/toast";
import {
  getCertificateList,
  IGetListCertificate,
} from "@/api/admin/api-teachers/detail-teacher/get-list-certificate.api";

const TeacherDetail: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<IGetListTeachers | null>(null);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<ICertificate>({
    certificate_name: "",
    score: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [certificates, setCertificates] = useState<IGetListCertificate[]>([]);

  const getTeacherDetail = useCallback(() => {
    showLoading();
    getTeachersList({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        const selectedTeacher = res.data.find(
          (t) => t.id?.toString() === teacherId
        );
        setTeacher(selectedTeacher || null);
        removeLoading();
      },
      error: () => {
        removeLoading();
      },
    });
  }, [teacherId]);

  const getTeacherCertificates = useCallback(() => {
    if (teacherId) {
      showLoading();
      getCertificateList(teacherId).subscribe({
        next: (res) => {
          setCertificates(res.data);
          removeLoading();
        },
        error: () => {
          showToast({
            type: "error",
            content: "Lấy danh sách bằng cấp thất bại!",
          });
          removeLoading();
        },
      });
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      getTeacherDetail();
      getTeacherCertificates();
    }
  }, [teacherId, getTeacherDetail]);

  const columns: ColumnsType<{
    id: number;
    certificate: string;
    score_certificate: string;
  }> = [
    {
      title: "Bằng cấp",
      dataIndex: "certificate",
      key: "certificate",
      align: "center",
    },
    {
      title: "Điểm",
      align: "center",
      dataIndex: "score_certificate",
      key: "score_certificate",
      render: (score) => convertToInteger(score),
    },
    {
      title: "Sửa",
      key: "edit",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleOpenEditModal(record)}
        />
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteClick(record.id)}
        />
      ),
    },
  ];

  if (!teacher) return <p>Không tìm thấy giáo viên</p>;

  const handleAddCertificate = () => {
    setOpenModalAdd(true);
  };

  const handleCloseAddCertificate = () => {
    setOpenModalAdd(false);
    getTeacherDetail();
  };

  const handleOpenEditModal = (record: {
    id: number;
    certificate: string;
    score_certificate: string;
  }) => {
    const selectedCertificate = teacher?.certificate[record.id];

    setRecordSelected({
      certificate_name: selectedCertificate?.certificate_name || "",
      score: selectedCertificate?.score || "",
    });

    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getTeacherDetail();
  };

  const handleDeleteClick = (id: number) => {
    console.log(id)
    const certificateToDelete = certificates.find((cert) => cert.id === id);
    console.log(certificateToDelete)
    if (certificateToDelete) {
      setRecordSelected(certificateToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteCertificate = () => {
    if (recordSelected.id) {
      showLoading();
      // Gọi API xóa với ID của chứng chỉ
      deleteCertificate([recordSelected.id]).subscribe({
        next: () => {
          showToast({ type: "success", content: "Xóa thành công!" });
          setIsDeleteModalOpen(false);
          getTeacherCertificates(); // Tải lại danh sách chứng chỉ
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

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg">
      <div className="flex items-center space-x-10 gap-8">
        <Avatar src={teacher.avatar} size={100} className="border" />
        <div>
          <h2 className="text-xl font-bold">{teacher.name}</h2>
          <p>
            <strong>Mã giáo viên:</strong> {teacher.id}
          </p>
          <p>
            <strong>Giới tính:</strong> {formatGender(teacher.gender)}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{" "}
            {dayjs(teacher.dob).format("DD-MM-YYYY")}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-lg">Thông tin liên hệ</h3>
        <p>
          <strong>Số điện thoại:</strong> {teacher.phone}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {teacher.address}
        </p>
        <p>
          <strong>Email:</strong> {teacher.email}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-lg">Bằng cấp</h3>
        <Table
          dataSource={teacher.certificate.map((cert, index) => ({
            id: index,
            certificate: cert.certificate_name,
            score_certificate: cert.score,
          }))}
          columns={columns}
          rowKey="certificate"
          pagination={false}
        />
        <Button
          icon={<PlusOutlined />}
          className="mt-2"
          onClick={handleAddCertificate}
        >
          Thêm bằng cấp
        </Button>

        <AddCertificate
          isOpen={openModalAdd}
          onClose={handleCloseAddCertificate}
        />
        <EditCertificate
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          recordSelected={recordSelected}
        />

        <Modal
          title="Xác nhận xóa"
          visible={isDeleteModalOpen}
          onOk={() => handleDeleteCertificate()}
          onCancel={handleCancelDelete}
          okText="Xóa"
          okButtonProps={{ danger: true }}
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa?</p>
        </Modal>
      </div>
    </Card>
  );
};

export default TeacherDetail;
