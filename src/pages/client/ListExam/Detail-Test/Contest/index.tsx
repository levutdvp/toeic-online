import {
  getListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { getListQuestionTestFull } from "@/api/client/get-list-question-test-full.api";
import { IGetListTest } from "@/api/client/get-list-test.api";
import { submitTest } from "@/api/client/submit-answer.api";
import { useAuth } from "@/hooks/use-auth.hook";
import { removeLoading, showLoading } from "@/services/loading";
import { showToast } from "@/services/toast";
import { Button, Modal, Radio, Space } from "antd";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CiCircleInfo } from "react-icons/ci";

export default function ExamLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const testData = location.state as IGetListTest;

  useEffect(() => {
    if (!testData) {
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

  const { userInfo } = useAuth();

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

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
    if (!testData?.exam_code) {
      return;
    }
    showLoading();

    if (Number(testData.part_number) === 0) {
      getListQuestionTestFull(testData.exam_code).subscribe({
        next: (res) => {
          const allQuestions: IQuestion[] = [];
          const partCounts: Record<string, number> = {};

          Object.entries(res.questions).forEach(
            ([partNumber, partQuestions]) => {
              if (Array.isArray(partQuestions)) {
                const questionsWithPart = partQuestions.map((q) => ({
                  ...q,
                  part_number: partNumber,
                }));
                allQuestions.push(...questionsWithPart);
                partCounts[partNumber] = partQuestions.length;
              }
            }
          );

          setQuestions(allQuestions);
          removeLoading();
          setSelectedAnswers({});
        },
        error: () => {
          removeLoading();
          showToast({ type: "error", content: "Không thể tải câu hỏi!" });
        },
      });
    } else {
      getListQuestionTest(
        testData.exam_code,
        Number(testData.part_number)
      ).subscribe({
        next: (res) => {
          const allQuestions: IQuestion[] = [];
          const partCounts: Record<string, number> = {};

          Object.entries(res.questions).forEach(
            ([partNumber, partQuestions]) => {
              if (Array.isArray(partQuestions)) {
                allQuestions.push(...partQuestions);
                partCounts[partNumber] = partQuestions.length;
              }
            }
          );

          setQuestions(allQuestions);
          removeLoading();
          setSelectedAnswers({});
        },
        error: () => {
          removeLoading();
          showToast({ type: "error", content: "Không thể tải câu hỏi!" });
        },
      });
    }
  }, [testData]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, testData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    if (audioElement && currentQuestion?.audio_url) {
      audioElement.src = currentQuestion.audio_url;
      audioElement.load();
    }
  }, [currentQuestionIndex, currentQuestion?.audio_url]);

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
    }
  };

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
    let formattedData;

    if (Number(testData.part_number) === 0) {
      // Group questions by part number for full test
      const questionsByPart = questions.reduce((acc, question, index) => {
        const partNumber = Number(question.part_number);
        if (!acc[partNumber]) {
          acc[partNumber] = [];
        }
        acc[partNumber].push({
          question_number: question.question_number,
          user_answer: selectedAnswers[index] || "",
          correct_answer: question.correct_answer,
        });
        return acc;
      }, {} as Record<number, Array<{ question_number: number; user_answer: string; correct_answer: string }>>);

      formattedData = {
        user_id: userInfo.id,
        exam_code: testData.exam_code,
        parts: Object.entries(questionsByPart).map(([partNumber, answers]) => ({
          part_number: Number(partNumber),
          answers,
        })),
      };
    } else {
      formattedData = {
        user_id: userInfo.id,
        exam_code: testData.exam_code,
        parts: [
          {
            part_number: Number(testData.part_number),
            answers: questions.map((q, index) => ({
              question_number: q.question_number,
              user_answer: selectedAnswers[index] || "",
              correct_answer: q.correct_answer,
            })),
          },
        ],
      };
    }

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
  }, [testData, questions, selectedAnswers]);

  if (!testData) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            {Number(testData.part_number) === 0 ? (
              <div>
                Full Test:{" "}
                {currentQuestion
                  ? `Part ${currentQuestion.part_number} - Question ${currentQuestion.question_number}`
                  : "Loading..."}
                {/* <div className="text-sm mt-1">
                  {Object.entries(questionsPerPart).map(([part, count]) => {
                    const completed = getCompletedQuestionsPerPart()[part] || 0;
                    return (
                      <span key={part} className="mr-4">
                        Part {part}: {completed}/{count} questions
                      </span>
                    );
                  })}
                </div> */}
              </div>
            ) : (
              `Part ${testData.part_number}: Question ${
                currentQuestionIndex + 1
              } of ${questions.length}`
            )}
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

          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {["1", "2", "3", "4", "5", "6", "7"].map((part) => {
              // Only show the current part when testing a specific part
              if (
                Number(testData.part_number) !== 0 &&
                String(testData.part_number) !== part
              ) {
                return null;
              }

              const partQuestions = Array.isArray(questions)
                ? questions.filter((q) => String(q.part_number) === part)
                : [];

              if (partQuestions.length === 0) {
                return null;
              }

              return (
                <div key={part} className="mb-6">
                  <h3 className="font-bold mb-3 sticky top-0 bg-white py-2 z-10">
                    Part {part}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {partQuestions.map((question) => {
                      // For full test, calculate global index based on all questions
                      const globalIndex =
                        Number(testData.part_number) === 0
                          ? questions.findIndex(
                              (q) =>
                                q.part_number === question.part_number &&
                                q.question_number === question.question_number
                            )
                          : questions.findIndex((q) => q.id === question.id);

                      // Check if the answer exists and is not an empty string
                      const isAnswered =
                        selectedAnswers[globalIndex] &&
                        selectedAnswers[globalIndex].trim() !== "";
                      const isCurrent = globalIndex === currentQuestionIndex;

                      return (
                        <Button
                          key={
                            question.id ||
                            `${question.part_number}-${question.question_number}`
                          }
                          onClick={() => handleQuestionClick(globalIndex)}
                          className={`h-10 ${
                            isCurrent
                              ? "border !border-blue-500 !bg-blue-50"
                              : isAnswered
                              ? "border !border-green-500 !bg-green-50"
                              : "border !border-gray-300"
                          }`}
                        >
                          {question.question_number}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
