import { Card, Avatar, Button, Table } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { removeLoading, showLoading } from "@/services/loading";
import {
  getTeachersList,
  IGetListTeachers,
} from "@/api/admin/api-teachers/get-list-teacherInfo.api";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { convertToInteger, formatGender } from "@/utils/map.util";
import { ColumnsType } from "antd/es/table";
import AddCertificate from "./add";
import EditCertificate from "./edit";

const TeacherDetail: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<IGetListTeachers | null>(null);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [recordSelected, setRecordSelected] = useState<IGetListTeachers>();

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

  useEffect(() => {
    if (teacherId) getTeacherDetail();
  }, [teacherId, getTeacherDetail]);

  const columns: ColumnsType<{
    key: number;
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
      render: () => <Button icon={<DeleteOutlined />} danger />,
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

  const handleOpenEditModal = (record: { key: number; certificate: string; score_certificate: string }) => {
      setRecordSelected({
        ...teacher,
        certificate: teacher?.certificate.map((cert, index) =>
          index === record.key ? { ...cert, certificate_name: record.certificate, score: record.score_certificate } : cert
        ),
      } as IGetListTeachers);
      setIsEditModalOpen(true);
    };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getTeacherDetail();
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
            key: index,
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
      </div>
    </Card>
  );
};

export default TeacherDetail;
