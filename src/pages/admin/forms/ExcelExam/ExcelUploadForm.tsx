import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import "antd/dist/reset.css";
import { getExcelExam } from "@/api/admin/api-exam/excel-exam.api";
import { removeLoading } from "@/services/loading";
import { showToast } from "@/services/toast";

const ExcelUploadForm = () => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const apiSubRef = useRef<any>(null);

  const handleUploadExcel = useCallback(() => {
    if (fileList.length === 0) {
      showToast({
        content: "Vui lòng chọn 1 file Excel để tải lên",
        type: "error",
      });
      return;
    }

    const file = fileList[0];

    setIsUploading(true);

    apiSubRef.current = getExcelExam(file).subscribe({
      next: (res) => {
        console.log("Dữ liệu nhận về từ API:", res);
        showToast({
          content: "Tải lên file Excel thành công",
          type: "success",
        });
        setIsUploading(false);
        setFileList([]);
        removeLoading();
      },
      error: () => {
        setIsUploading(false);
      },
    });

    apiSubRef.current.add();
  }, [fileList]);

  useEffect(() => {
    return () => {
      if (apiSubRef.current) {
        apiSubRef.current.unsubscribe();
      }
    };
  }, []);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        showToast({
          content: "Vui lòng chọn file Excel (.xlsx, .xls)",
          type: "error",
        });
      }
      return isExcel || Upload.LIST_IGNORE;
    },
    onChange(info) {
      setFileList(info.fileList.map((f) => f.originFileObj as RcFile));
    },
    fileList: fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      status: "done",
    })),
    maxCount: 1,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tải lên đề thi (Excel)
        </h2>
        <Upload {...uploadProps}>
          <Button
            icon={<UploadOutlined />}
            style={{ width: "100%", marginBottom: "16px" }}
          >
            Chọn file Excel
          </Button>
        </Upload>
        <Button
          type="primary"
          loading={isUploading}
          onClick={handleUploadExcel}
          className="w-full"
          disabled={fileList.length === 0}
        >
          {isUploading ? "Đang xử lý..." : "Gửi và xử lý file"}
        </Button>
      </div>
    </div>
  );
};

export default ExcelUploadForm;
