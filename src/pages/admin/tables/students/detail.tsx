import { uploadFile } from "@/api/admin/api-exam/upload-file.api";
import {
  getStudentsList,
  IGetListStudents,
} from "@/api/admin/api-students/get-list-studentInfo.api";
import { uploadAvatarStudent } from "@/api/admin/api-students/upload-avatar-student.api";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { formatGender } from "@/utils/map.util";
import { Avatar, Modal } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  studentId: number;
  onClose: () => void;
}

const ModalStudentDetail = ({ studentId, onClose }: Props) => {
  const [student, setStudent] = useState<IGetListStudents | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStudentDetail = useCallback(() => {
    showLoading();
    getStudentsList({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        const selectedStudent = res.data.find(
          (s) => s.id?.toString() === studentId.toString()
        );
        setStudent(selectedStudent || null);
        removeLoading();
      },
      error: () => {
        showToast({
          type: "error",
          content: "Lấy thông tin học viên thất bại!",
        });
        removeLoading();
      },
    });
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      getStudentDetail();
    }
  }, [studentId, getStudentDetail]);

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
        uploadAvatarStudent({
          id: studentId,
          image_link: res.image_url,
        }).subscribe({
          next: () => {
            showToast({
              type: "success",
              content: "Cập nhật ảnh đại diện thành công!",
            });
            getStudentDetail();
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

  return (
    <Modal
      open={true}
      onCancel={onClose}
      onOk={onClose}
      width={600}
      footer={false}
    >
      <div className="flex items-center space-x-10 gap-8">
        <div className="relative cursor-pointer" onClick={handleAvatarClick}>
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
            <Avatar src={student?.avatar} size={100} className="border" />
          )}
        </div>
        <div className="ml-10">
          <h2 className="text-xl font-bold">{student?.name}</h2>
          <p>
            <strong>Mã học viên:</strong> {student?.id}
          </p>
          <p>
            <strong>Giới tính:</strong> {formatGender(student?.gender || "")}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{" "}
            {student?.dob ? dayjs(student?.dob).format("DD-MM-YYYY") : "-"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-lg mb-2">Thông tin liên hệ</h3>
        <div className="flex gap-24">
          <div className="flex flex-col gap-2">
            <p className="mb-2">
              <strong>Số điện thoại:</strong> {student?.phone || "-"}
            </p>
            <p className="mb-2">
              <strong>Địa chỉ:</strong> {student?.address || "-"}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {student?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalStudentDetail;
