import {
  getListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { IGetListTest } from "@/api/client/get-list-test.api";
import { submitTest } from "@/api/client/submit-answer.api";
import { useAuth } from "@/hooks/use-auth.hook";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Modal, Radio, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CiCircleInfo } from "react-icons/ci";

export default function ExamLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const testData = location.state as IGetListTest;

  useEffect(() => {
    if (!testData) {
      showToast({
        type: "error",
        content: "Không tìm thấy thông tin bài thi!",
      });
      navigate("/");
      return;
    }
  }, [testData, navigate]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string | null>
  >({});
  const [timeLeft, setTimeLeft] = useState<number>(
    (testData?.duration || 0) * 60
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] =
    useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const { userInfo } = useAuth();

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsModalVisible(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuestions = useCallback(() => {
    if (!testData?.exam_code || !testData?.part_number) {
      return;
    }

    showLoading();
    getListQuestionTest(
      testData.exam_code,
      Number(testData.part_number)
    ).subscribe({
      next: (res) => {
        setQuestions(res.questions);
        console.log("Questions loaded:", res.questions);
        removeLoading();
        setSelectedAnswers({});
      },
      error: (error) => {
        console.error("Error loading questions:", error);
        removeLoading();
        showToast({ type: "error", content: "Không thể tải câu hỏi!" });
      },
    });
  }, [testData]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    if (audioElement && currentQuestion?.audio_url) {
      audioElement.src = currentQuestion.audio_url;
      audioElement.playbackRate = playbackRate;
      audioElement.load();
    }
  }, [currentQuestionIndex, currentQuestion?.audio_url, playbackRate]);

  const handleSelectAnswer = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleSubmitTest = useCallback(() => {
    if (!testData?.exam_code || !userInfo?.id) {
      showToast({ type: "error", content: "Thiếu thông tin để nộp bài!" });
      return;
    }

    showLoading();

    const formattedData = {
      user_id: userInfo.id,
      exam_code: testData.exam_code,
      parts: [
        {
          part_number: Number(testData.part_number),
          answers: questions.map((q, index) => ({
            user_answer: selectedAnswers[index] || "",
            correct_answer: q.correct_answer,
          })),
        },
      ],
    };

    submitTest(formattedData).subscribe({
      next: (res) => {
        removeLoading();
        setIsSubmitModalVisible(false);
        navigate("/test/result", {
          state: {
            exam_code: testData.exam_code,
            part_number: testData.part_number,
            result: res.data,
            submittedData: formattedData,
            questions,
          },
        });
      },
      error: () => {
        showToast({ type: "error", content: "Nộp bài thất bại!" });
        removeLoading();
      },
    });
  }, [testData, questions, selectedAnswers, userInfo, navigate]);

  if (!testData) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            Listening: Question {currentQuestionIndex + 1} of {questions.length}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="solid" size="large" shape="round">
            {currentQuestionIndex + 1}/{questions.length}
          </Button>
          <Button color="red" variant="solid" size="large" shape="round">
            Time: {formatTime(timeLeft)}
          </Button>
          <Button
            type="primary"
            className="text-white"
            size="large"
            shape="round"
            onClick={() => setIsSubmitModalVisible(true)}
          >
            Nộp bài
          </Button>
        </div>
      </header>

      <div className="flex flex-1 p-4 gap-4">
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Question {currentQuestionIndex + 1}
            </h2>
            {currentQuestion?.audio_url && (
              <div className="mb-4">
                <audio
                  id="audioElement"
                  controls
                  className="w-full"
                  src={currentQuestion.audio_url}
                >
                  Your browser does not support the audio element.
                </audio>
                <div className="mt-2 flex gap-2">
                  <Button onClick={() => setPlaybackRate(0.75)}>0.75x</Button>
                  <Button onClick={() => setPlaybackRate(1)}>1x</Button>
                  <Button onClick={() => setPlaybackRate(1.25)}>1.25x</Button>
                  <Button onClick={() => setPlaybackRate(1.5)}>1.5x</Button>
                </div>
              </div>
            )}
            {currentQuestion?.image_url && (
              <div className="mb-4">
                <img
                  src={currentQuestion.image_url}
                  alt="Question"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Question {currentQuestionIndex + 1}
          </h2>
          <p className="mb-4">{currentQuestion?.question_text}</p>
          <Radio.Group
            value={selectedAnswers[currentQuestionIndex] || null}
            onChange={(e) => handleSelectAnswer(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" size="middle" className="w-full">
              {currentQuestion &&
                ["A", "B", "C", "D"].map((option) => {
                  const optionKey =
                    `option_${option.toLowerCase()}` as keyof IQuestion;
                  const optionText = currentQuestion[optionKey];

                  return (
                    <Radio
                      key={option}
                      value={option}
                      className={`
                      !w-full !p-2 !rounded-lg !transition-all !duration-200 !border-gray-500 !bg-white !hover:bg-gray-50`}
                    >
                      <span className="text-base">
                        ({option}) {optionText}
                      </span>
                    </Radio>
                  );
                })}
            </Space>
          </Radio.Group>
        </div>

        <div className="w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Đánh dấu</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Câu hỏi đã hoàn thành</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>Câu hỏi hiện tại</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Part {testData.part_number}</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const isAnswered = !!selectedAnswers[index];
                const isCurrent = index === currentQuestionIndex;
                return (
                  <Button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    style={{
                      border: isCurrent
                        ? "1px solid #1890ff"
                        : isAnswered
                        ? "1px solid #52c41a"
                        : "1px solid #d9d9d9",
                      backgroundColor: isCurrent
                        ? "#e6f7ff"
                        : isAnswered
                        ? "#f0fff4"
                        : "white",
                    }}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white p-4 flex justify-center gap-4 shadow-md">
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu tiếp
        </Button>
      </footer>

      <Modal
        title={
          <span className="text-red-500">Đã hết thời gian làm bài thi!</span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={handleSubmitTest}>
            Đồng ý
          </Button>,
        ]}
      >
        <p>Bạn đã hoàn thành bài thi này!</p>
      </Modal>

      <Modal
        title={
          <span className="flex items-center gap-2">
            <CiCircleInfo className="text-blue-500 text-xl" />
            Đã hoàn thành bài kiểm tra?
          </span>
        }
        open={isSubmitModalVisible}
        onCancel={() => setIsSubmitModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsSubmitModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitTest}>
            Đồng ý
          </Button>,
        ]}
      >
        <p>
          Hãy chắc chắn rằng bạn không bỏ sót điều gì trước khi xác nhận việc
          hoàn thành bài kiểm tra!
        </p>
      </Modal>
    </div>
  );
}
