import { createQuestion } from "@/api/admin/api-exam/create-question.api";
import { getExcelExam, IQuestion } from "@/api/admin/api-exam/excel-exam.api";
import { getListExam, IGetListTest } from "@/api/client/get-list-test.api";
import { removeLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Select, Space, Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { useCallback, useEffect, useRef, useState } from "react";

const ExcelUploadPart7 = () => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [mediaList, setMediaList] = useState<
    { audio_url: string; image_url: string }[]
  >([]);
  const [fileNames, setFileNames] = useState<{
    audio_file_name: string[];
    image_file_name: string[];
  }>({
    audio_file_name: [],
    image_file_name: [],
  });
  const [examCode, setExamCode] = useState("");
  const [examList, setExamList] = useState<IGetListTest[]>([]);
  const partNumber = 7;
  const apiSubRef = useRef<any>(null);

  useEffect(() => {
    const sub = getListExam({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        removeLoading();
        setExamList(res.data);
      },
      error: () => {
        showToast({ content: "Lỗi khi tải danh sách đề thi", type: "error" });
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const handleUploadExcel = useCallback(() => {
    if (fileList.length === 0) {
      showToast({ content: "Vui lòng chọn 1 file Excel", type: "error" });
      return;
    }

    if (!examCode) {
      showToast({ content: "Vui lòng chọn mã đề thi", type: "error" });
      return;
    }

    const file = fileList[0];
    setIsUploading(true);

    apiSubRef.current = getExcelExam(file, partNumber).subscribe({
      next: (res) => {
        showToast({
          content: "Tải lên file Excel thành công",
          type: "success",
        });
        setIsUploading(false);
        setFileList([]);

        const extractedQuestions: IQuestion[] = res.data.groups.map(
          (group) => group.questions
        );
        setQuestions(extractedQuestions);

        setMediaList(
          extractedQuestions.map(() => ({ audio_url: "", image_url: "" }))
        );

        removeLoading();
      },
      error: () => {
        setIsUploading(false);
      },
    });

    apiSubRef.current.add();
  }, [fileList, examCode]);

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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (
    file: RcFile,
    index: number,
    type: "audio" | "image"
  ) => {
    const base64 = await convertToBase64(file);
    const updatedList = [...mediaList];
    if (type === "audio") updatedList[index].audio_url = base64;
    else updatedList[index].image_url = base64;
    setMediaList(updatedList);
    const updatedFileNames = { ...fileNames };
    if (type === "audio") {
      updatedFileNames.audio_file_name[index] = file.name;
    } else {
      updatedFileNames.image_file_name[index] = file.name;
    }

    setFileNames(updatedFileNames);
  };

  const handleRemove = (index: number, type: "audio" | "image") => {
    const updatedList = [...mediaList];
    if (type === "audio") updatedList[index].audio_url = "";
    else updatedList[index].image_url = "";
    setMediaList(updatedList);
    const updatedFileNames = { ...fileNames };
    if (type === "audio") updatedFileNames.audio_file_name[index] = "";
    else updatedFileNames.image_file_name[index] = "";
    setFileNames(updatedFileNames);
  };

  const handleSubmitAll = () => {
    if (!examCode) {
      showToast({ content: "Vui lòng nhập tên đề thi", type: "error" });
      return;
    }

    const isValid = mediaList.every(
      (m) => m.audio_url !== "" && m.image_url !== ""
    );
    if (!isValid) {
      showToast({
        content: "Vui lòng upload đầy đủ audio và image cho tất cả câu hỏi",
        type: "error",
      });
      return;
    }

    questions.forEach((question, idx) => {
      const payload = {
        audio_url: mediaList[idx].audio_url,
        image_url: mediaList[idx].image_url,
      };

      createQuestion(payload, partNumber, examCode).subscribe({
        next: () => {
          showToast({
            content: `Gửi câu hỏi ${question.question_number} thành công!`,
            type: "success",
          });
        },
        error: () => {
          showToast({
            content: `Gửi câu hỏi ${question.question_number} thất bại.`,
            type: "error",
          });
        },
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tải lên đề thi (Part 7)
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
          className="w-full mb-4"
          disabled={fileList.length === 0 || !examCode}
        >
          {isUploading ? "Đang xử lý..." : "Gửi và xử lý file"}
        </Button>

        <Select
          showSearch
          placeholder="Chọn mã đề thi"
          onChange={(value) => {
            setExamCode(value.split("@@")[1]);
          }}
          style={{ width: "100%", marginBottom: "16px" }}
          options={examList.map((exam, index) => {
            return {
              label: `${exam.exam_name} (${exam.exam_code})`,
              value: `${index}@@${exam.exam_code}`,
            };
          })}
          notFoundContent="Không tìm thấy đề thi"
          status={!examCode && fileList.length > 0 ? "error" : undefined}
        />

        {questions.length > 0 && (
          <div className="space-y-6 max-h-[500px] overflow-y-auto mb-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 flex flex-col"
              >
                <p>
                  Câu hỏi {question.question_number}: {question.question_text}
                </p>

                <Space direction="horizontal" size="middle">
                  <Upload
                    beforeUpload={async (file) => {
                      await handleFileUpload(file as RcFile, index, "audio");
                      return Upload.LIST_IGNORE;
                    }}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Audio</Button>
                  </Upload>
                  {fileNames.audio_file_name[index] && (
                    <div className="flex items-center">
                      <span>{fileNames.audio_file_name[index]}</span>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleRemove(index, "audio")}
                        style={{ marginLeft: "8px" }}
                      />
                    </div>
                  )}
                </Space>

                <Space direction="horizontal" size="middle">
                  <Upload
                    beforeUpload={async (file) => {
                      await handleFileUpload(file as RcFile, index, "image");
                      return Upload.LIST_IGNORE;
                    }}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                  {fileNames.image_file_name[index] && (
                    <div className="flex items-center">
                      <span>{fileNames.image_file_name[index]}</span>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleRemove(index, "image")}
                        style={{ marginLeft: "8px" }}
                      />
                    </div>
                  )}
                </Space>
              </div>
            ))}

            <Button type="primary" className="w-full" onClick={handleSubmitAll}>
              Gửi toàn bộ câu hỏi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelUploadPart7;
