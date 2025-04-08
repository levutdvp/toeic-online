import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { removeLoading, showLoading } from "@/services/loading";
import { useAuth } from "@/hooks/use-auth.hook";
import {
  getExamHistoryDetail,
  IExamHistoryDetailResponse,
  IExamHistoryDetailResponseData,
} from "@/api/common/exam-history-detail.api";

interface ExamHistoryDetailState {
  exam_date: string;
  user_id: number;
  exam_code: string;
  part_number: number;
  exam_name: string;
  score: number;
}

const ExamHistoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ExamHistoryDetailState;
  const { userRoles } = useAuth();

  const [questions, setQuestions] = useState<IExamHistoryDetailResponseData>(
    {}
  );

  const [selectedQuestion, setSelectedQuestion] =
    useState<IExamHistoryDetailResponse | null>(null);

  useEffect(() => {
    if (!state) {
      navigate("/exam-history");
      return;
    }

    showLoading();
    const subscription = getExamHistoryDetail({
      exam_date: state.exam_date,
      user_id: state.user_id,
      exam_code: state.exam_code,
      part_number: state.part_number,
    }).subscribe({
      next: (res) => {
        setQuestions(res.data);
        if (res.data["1"] && res.data["1"].length > 0) {
          setSelectedQuestion(res.data["1"][0]);
        }
        removeLoading();
      },
      error: (err) => {
        console.error("Error fetching exam history detail:", err);
        removeLoading();
      },
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [state, navigate]);

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">Không có dữ liệu!</p>
      </div>
    );
  }

  const getAnswerStyle = (
    option: string,
    userAnswer: string | null,
    correctAnswer: string
  ) => {
    if (option === correctAnswer) {
      return "border-[#52C41A] bg-[#F6FFED]";
    }
    if (option === userAnswer && userAnswer !== correctAnswer) {
      return "border-[#FF4D4F] bg-[#FFF1F0]";
    }
    return "border-gray-200 bg-white";
  };

  const allQuestions = Object.values(questions).flat();
  const correctAnswers = allQuestions.filter((q) => q.is_correct).length;
  const totalQuestions = allQuestions.length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
        <Button
          type="text"
          onClick={() => {
            const isAdminOrTeacher = userRoles.some((role) =>
              ["ADMIN", "TEACHER"].includes(role)
            );
            navigate(
              isAdminOrTeacher ? "/admin/users-student" : "/exam-history"
            );
          }}
          className="!text-white !hover:text-gray-300 !font-medium"
        >
          ← Quay lại
        </Button>
        <h2 className="text-xl font-semibold">
          Chi tiết bài thi: {state.exam_name}
        </h2>
        <div className="w-[100px]"></div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Score Card */}
        <div className="col-span-3">
          <Card className="shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <FlagOutlined className="!text-2xl !text-yellow-500" />
              <h3 className="text-xl font-bold">Điểm của bạn</h3>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-4">{state.score}</p>
              <div className="space-y-2">
                <p className="text-lg">
                  Số câu đúng: {correctAnswers}/{totalQuestions}
                </p>
                <p className="text-lg">
                  Tỷ lệ đúng:{" "}
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Question Detail */}
        <div className="col-span-6">
          <Card className="shadow-md">
            {selectedQuestion ? (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Câu {selectedQuestion.question_number}
                </h3>

                {selectedQuestion.audio_url && (
                  <div className="mb-4">
                    <audio controls className="w-full">
                      <source
                        src={selectedQuestion.audio_url}
                        type="audio/mpeg"
                      />
                    </audio>
                  </div>
                )}

                {selectedQuestion.image_url && (
                  <div className="mb-4">
                    <img
                      src={selectedQuestion.image_url}
                      alt="Question"
                      className="max-w-full rounded-lg"
                    />
                  </div>
                )}

                <p className="text-lg mb-4">{selectedQuestion.question_text}</p>

                <div className="space-y-3">
                  {["A", "B", "C", "D"].map((option) => {
                    const optionKey =
                      `option_${option.toLowerCase()}` as keyof IExamHistoryDetailResponse;
                    return (
                      <div
                        key={option}
                        className={`p-4 border-2 rounded-lg flex items-center justify-between ${getAnswerStyle(
                          option,
                          selectedQuestion.user_answer,
                          selectedQuestion.correct_answer
                        )}`}
                      >
                        <span className="text-base">
                          ({option}) {selectedQuestion[optionKey]}
                        </span>
                        {option === selectedQuestion.correct_answer && (
                          <span className="px-3 py-1 bg-[#52C41A] text-white rounded-full text-sm">
                            Đáp án đúng
                          </span>
                        )}
                        {option === selectedQuestion.user_answer &&
                          option !== selectedQuestion.correct_answer && (
                            <span className="px-3 py-1 bg-[#FF4D4F] text-white rounded-full text-sm">
                              Bạn đã chọn
                            </span>
                          )}
                      </div>
                    );
                  })}
                </div>

                {selectedQuestion.explanation && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Giải thích:</h4>
                    <p>{selectedQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                Chọn một câu hỏi để xem chi tiết
              </p>
            )}
          </Card>
        </div>

        {/* Question Navigation */}
        <div className="col-span-3">
          <Card className="shadow-md">
            <h3 className="text-lg font-bold mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2 max-h-[600px] overflow-y-auto">
              {Object.entries(questions).map(([part, partQuestions]) => (
                <React.Fragment key={part}>
                  <div className="col-span-5 font-semibold mb-2">
                    Part {part}
                  </div>
                  {partQuestions.map((question) => (
                    <Button
                      key={question.question_number}
                      onClick={() => setSelectedQuestion(question)}
                      className={`!h-10 ${
                        question.is_correct
                          ? "!border-[#52C41A] !bg-[#F6FFED]"
                          : "!border-[#FF4D4F] !bg-[#FFF1F0]"
                      }`}
                    >
                      {question.question_number}
                    </Button>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamHistoryDetail;
