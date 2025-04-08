import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { getListQuestionTestFull } from "@/api/client/get-list-question-test-full.api";
import { removeLoading, showLoading } from "@/services/loading";

interface ExamResultState {
  exam_code: string;
  part_number: string;
  result: {
    part_number: number;
    correct_answers: number;
    wrong_answers: number;
    score: number;
  }[];
  submittedData: {
    parts: {
      part_number: number;
      answers: {
        question_number: number;
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
    let subscription;

    if (Number(state.part_number) === 0) {
      // Full test case
      subscription = getListQuestionTestFull(state.exam_code).subscribe({
        next: (res) => {
          const allQuestions: IQuestion[] = [];
          Object.entries(res.questions).forEach(
            ([partNumber, partQuestions]) => {
              if (Array.isArray(partQuestions)) {
                const questionsWithPart = partQuestions.map((q) => ({
                  ...q,
                  part_number: partNumber,
                }));
                allQuestions.push(...questionsWithPart);
              }
            }
          );
          setQuestions(allQuestions);
          if (allQuestions.length > 0) {
            setSelectedQuestion(allQuestions[0]);
          }
          removeLoading();
        },
        error: (err) => {
          console.error("Error fetching questions:", err);
          removeLoading();
        },
      });
    } else {
      // Part test case
      subscription = getListQuestionTest(
        state.exam_code,
        Number(state.part_number)
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
        },
        error: (err) => {
          console.error("Error fetching questions:", err);
          removeLoading();
        },
      });
    }

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
    user_answer: string,
    correct_answer: string
  ) => {
    if (option === correct_answer) {
      return "border-[#52C41A] bg-[#F6FFED]";
    }
    if (option === user_answer && user_answer !== correct_answer) {
      return "border-[#FF4D4F] bg-[#FFF1F0]";
    }
    return "border-gray-200 bg-white";
  };

  // Ensure questions is always an array before rendering
  const safeQuestions = Array.isArray(questions) ? questions : [];

  // First, let's define a standalone function to find the answer for a question
  const findAnswerForQuestion = (question: IQuestion) => {
    if (Number(state.part_number) === 0) {
      // For full test
      const part = state.submittedData.parts.find(
        (p) => p.part_number === Number(question.part_number)
      );

      if (part) {
        return part.answers.find(
          (a) => a.question_number === question.question_number
        );
      }
    } else {
      // For single part
      return state.submittedData.parts[0].answers.find(
        (a) => a.question_number === question.question_number
      );
    }
    return null;
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
          {Number(state.part_number) === 0
            ? "Kết quả Full Test"
            : `Kết quả Part ${state.part_number}`}
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
              <p className="text-5xl font-bold mb-4">
                {partResult ? partResult.score : 0}
              </p>
              <div className="space-y-2">
                <p className="text-lg">
                  Số câu đúng: {partResult?.correct_answers ?? 0}/
                  {safeQuestions.length}
                </p>
                <p className="text-lg">
                  Số câu sai: {partResult?.wrong_answers ?? 0}
                </p>
                <p className="text-lg">
                  Tỷ lệ đúng:{" "}
                  {safeQuestions.length > 0
                    ? Math.round(
                        ((partResult?.correct_answers ?? 0) /
                          safeQuestions.length) *
                          100
                      )
                    : 0}
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
                  {Number(state.part_number) === 0
                    ? `Part ${selectedQuestion.part_number} - Câu ${selectedQuestion.question_number}`
                    : `Câu ${selectedQuestion.question_number}`}
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
                    let answer;
                    if (Number(state.part_number) === 0) {
                      const part = state.submittedData.parts.find(
                        (p) =>
                          p.part_number === Number(selectedQuestion.part_number)
                      );
                      if (part) {
                        answer = part.answers.find(
                          (a) =>
                            a.question_number ===
                            selectedQuestion.question_number
                        );
                      }
                    } else {
                      const part = state.submittedData.parts[0];
                      answer = part.answers.find(
                        (a) =>
                          a.question_number === selectedQuestion.question_number
                      );
                    }

                    if (!answer) return null;

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
            <div className="h-[calc(100vh-300px)] overflow-y-auto">
              {["1", "2", "3", "4", "5", "6", "7"].map((part) => {
                // Only show the current part when testing a specific part
                if (
                  Number(state.part_number) !== 0 &&
                  String(state.part_number) !== part
                ) {
                  return null;
                }

                const partQuestions = safeQuestions.filter(
                  (q) => String(q.part_number) === part
                );

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
                        // Find the relevant part and answer
                        const answer = findAnswerForQuestion(question);

                        // Skip if answer not found
                        if (!answer) return null;

                        const isCorrect =
                          answer.user_answer === answer.correct_answer;

                        return (
                          <Button
                            key={question.id}
                            onClick={() => setSelectedQuestion(question)}
                            className={
                              isCorrect
                                ? "!border-2 border-[#52c41a] !bg-[#f6ffed]"
                                : "!border-2 border-[#ed9d98] !bg-[#ed9d98]"
                            }
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
