import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Button, Space, Progress, Select } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import { getExcelExam, IQuestion } from "@/api/admin/api-exam/excel-exam.api";
import { createQuestion } from "@/api/admin/api-exam/create-question.api";
import { removeLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { uploadFile } from "@/api/admin/api-exam/upload-file.api";
import { lastValueFrom } from "rxjs";
import { convertFileToBase64 } from "@/utils/convertFilesToBase64.util";
import { getListExam, IGetListTest } from "@/api/client/get-list-test.api";

const ExcelUploadPart1 = () => {
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [examList, setExamList] = useState<IGetListTest[]>([]);
  const partNumber = 1;
  const apiSubRef = useRef<any>(null);

  useEffect(() => {
    const sub = getListExam({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        removeLoading();
        if (res && res.data && Array.isArray(res.data)) {
          setExamList(res.data);
        } else {
          console.error("Dữ liệu không đúng định dạng:", res);
          showToast({
            content: "Dữ liệu đề thi không đúng định dạng",
            type: "error",
          });
        }
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách đề thi:", err);
        showToast({ content: "Lỗi khi tải danh sách đề thi", type: "error" });
        removeLoading();
      },
      complete: () => {
        removeLoading();
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

  const handleFileUpload = async (
    file: RcFile,
    index: number,
    type: "audio" | "image"
  ) => {
    const base64 = await convertFileToBase64(file);
    const updatedList = [...mediaList];
    if (type === "audio") updatedList[index].audio_url = base64;
    else updatedList[index].image_url = base64;
    setMediaList(updatedList);

    const updatedFileNames = {
      audio_file_name: [...fileNames.audio_file_name],
      image_file_name: [...fileNames.image_file_name],
    };

    if (type === "audio") {
      while (updatedFileNames.audio_file_name.length <= index) {
        updatedFileNames.audio_file_name.push("");
      }
      updatedFileNames.audio_file_name[index] = file.name;
    } else {
      while (updatedFileNames.image_file_name.length <= index) {
        updatedFileNames.image_file_name.push("");
      }
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
  const handleSubmitAll = async () => {
    if (!examCode) {
      showToast({ content: "Vui lòng nhập mã đề thi", type: "error" });
      return;
    }

    try {
      setUploadProgress(0);
      const payloadData = [];
      for (let idx = 0; idx < questions.length; idx++) {
        const question = questions[idx];

        const audioFileName = fileNames.audio_file_name[idx];
        const imageFileName = fileNames.image_file_name[idx];

        let audioFile: File | undefined;
        let imageFile: File | undefined;

        if (mediaList[idx].audio_url) {
          const audioBlob = await fetch(mediaList[idx].audio_url).then((res) =>
            res.blob()
          );
          audioFile = new File([audioBlob], audioFileName, {
            type: audioBlob.type,
          });
        }

        if (mediaList[idx].image_url) {
          const imageBlob = await fetch(mediaList[idx].image_url).then((res) =>
            res.blob()
          );
          imageFile = new File([imageBlob], imageFileName, {
            type: imageBlob.type,
          });
        }

        const uploadResponse: any = await uploadFile({
          ...(audioFile && { audioFile }),
          ...(imageFile && { imageFile }),
        });

        const payload = {
          ...question,
          ...(uploadResponse?.audio_url && {
            audio_url: uploadResponse.audio_url,
          }),
          ...(uploadResponse?.image_url && {
            image_url: uploadResponse.image_url,
          }),
        };

        payloadData.push(payload);

        fileNames.audio_file_name[idx] = "";
        fileNames.image_file_name[idx] = "";
        setFileNames({ ...fileNames });

        setUploadProgress(
          parseFloat((((idx + 1) / questions.length) * 100).toFixed(2))
        );

        if (idx === questions.length - 1) {
          await lastValueFrom(
            createQuestion(
              { data: { groups: payloadData.map((q) => ({ questions: q })) } },
              partNumber,
              examCode
            )
          );
        }
      }

      showToast({
        content: "Gửi toàn bộ câu hỏi thành công!",
        type: "success",
      });

      setUploadProgress(null);
    } catch (e) {
      console.log("e", e);
      showToast({
        content: "Gửi câu hỏi thất bại. Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tải lên đề thi (Part 1)
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

            {uploadProgress !== null ? (
              <Progress percent={uploadProgress} status="active" />
            ) : (
              <Button
                type="primary"
                className="w-full"
                onClick={handleSubmitAll}
              >
                Gửi toàn bộ câu hỏi
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelUploadPart1;
