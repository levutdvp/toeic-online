import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { removeLoading, showLoading } from "@/services/loading";
import { ISubmitTestResponse } from "@/api/client/submit-answer.api";

interface ExamResultState {
  exam_code: string;
  part_number: string;
  result: ISubmitTestResponse[];
  submittedData: {
    parts: {
      part_number: number;
      answers: {
        user_answer: string;
        correct_answer: string;
      }[];
    }[];
  };
  questions: IQuestion[];
}

const ExamResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ExamResultState;

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );

  const partResult = state?.result?.find(
    (r) => r.part_number === Number(state.part_number)
  );

  useEffect(() => {
    if (!state) {
      navigate("/test");
      return;
    }

    showLoading();
    const subscription = getListQuestionTest(
      state.exam_code,
      Number(state.part_number)
    ).subscribe({
      next: (res) => {
        setQuestions(res.questions);
        if (res.questions.length > 0) {
          setSelectedQuestion(res.questions[0]);
        }
        removeLoading();
      },
      error: (err) => {
        console.error("Error fetching questions:", err);
        removeLoading();
      },
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [state, navigate]);

  if (!state || !questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">Không có dữ liệu!</p>
      </div>
    );
  }

  const getAnswerStyle = (
    option: string,
    userAnswer: string,
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
        <Button
          type="text"
          onClick={() => navigate("/test")}
          className="!text-white !hover:text-gray-300 !font-medium"
        >
          ← Quay lại
        </Button>
        <h2 className="text-xl font-semibold">
          Kết quả Part {state.part_number}
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
              <p className="text-5xl font-bold text-blue-600 mb-4">
                {partResult ? partResult.score : "--"}
              </p>
              <div className="space-y-2">
                <p className="text-lg">
                  Số câu đúng: {partResult?.correct_answers ?? 0}/
                  {questions.length}
                </p>
                <p className="text-lg">
                  Tỷ lệ đúng:{" "}
                  {Math.round(
                    ((partResult?.correct_answers ?? 0) / questions.length) *
                      100
                  )}
                  %
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
                    const questionIndex = questions.findIndex(
                      (q) => q.id === selectedQuestion.id
                    );
                    const answer =
                      state.submittedData.parts[0].answers[questionIndex];
                    const optionKey =
                      `option_${option.toLowerCase()}` as keyof IQuestion;

                    return (
                      <div
                        key={option}
                        className={`p-4 border-2 rounded-lg flex items-center justify-between ${getAnswerStyle(
                          option,
                          answer.user_answer,
                          answer.correct_answer
                        )}`}
                      >
                        <span className="text-base">
                          ({option}) {selectedQuestion[optionKey]}
                        </span>
                        {option === answer.correct_answer && (
                          <span className="px-3 py-1 bg-[#52C41A] text-white rounded-full text-sm">
                            Đáp án đúng
                          </span>
                        )}
                        {option === answer.user_answer &&
                          option !== answer.correct_answer && (
                            <span className="px-3 py-1 bg-[#FF4D4F] text-white rounded-full text-sm">
                              Bạn đã chọn
                            </span>
                          )}
                      </div>
                    );
                  })}
                </div>
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
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const answer = state.submittedData.parts[0].answers[index];
                const isCorrect = answer.user_answer === answer.correct_answer;

                return (
                  <Button
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`!h-10 ${
                      isCorrect
                        ? "!border-[#52C41A] !bg-[#F6FFED]"
                        : "!border-[#FF4D4F] !bg-[#FFF1F0]"
                    }`}
                  >
                    {question.question_number}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
