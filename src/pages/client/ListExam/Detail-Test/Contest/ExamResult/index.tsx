import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Subscription } from "rxjs";
import {
  getListQuestionTest,
  IGetListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { removeLoading } from "@/services/loading";
import { ISubmitTestResponse } from "@/api/client/submit-answer.api";

const ExamResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exam_code, part_number, result, submittedData } =
    location.state || {};

  const [data, setData] = useState<IGetListQuestionTest | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );

  const partResult = result?.find(
    (r: ISubmitTestResponse) => r.part_number === Number(part_number)
  );

  useEffect(() => {
    let subscription: Subscription;

    if (exam_code && part_number) {
      subscription = getListQuestionTest(
        exam_code,
        Number(part_number)
      ).subscribe({
        next: (res) => {
          setData(res);
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
  }, [exam_code, part_number]);

  if (!data)
    return <p className="text-center text-red-500">Không có dữ liệu!</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <Button
          type="text"
          onClick={() => navigate("/")}
          style={{ color: "white", fontSize: "16px", float: "left" }}
        >
          Back to Home
        </Button>
        <h2 className="text-lg font-semibold text-center">
          Test exam {data.exam_section.exam_name} - Part{" "}
          {data.exam_section.part_number}
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <FlagOutlined className="text-xl text-yellow-500" />
            <h3 className="text-xl font-bold mb-2.5">Điểm</h3>
          </div>
          <p className="text-4xl font-bold text-center mt-2">
            {partResult ? partResult.score : "--"}
          </p>
          <Card className="text-center" style={{ marginTop: "20px" }}>
            <p className="font-semibold text-lg">
              Part {data.exam_section.part_number}:
            </p>
            <p>{data.questions.length} câu hỏi</p>

            <p className="text-lg font-semibold">Trả lời đúng:</p>
            <p className="text-lg">
              {partResult?.correct_answers ?? 0} / {data.questions.length}
            </p>
          </Card>
        </div>

        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          {selectedQuestion ? (
            <>
              <h3 className="text-lg font-bold">
                Câu {selectedQuestion.question_number}
              </h3>

              {selectedQuestion.audio_url && (
                <audio controls className="mt-2">
                  <source src={selectedQuestion.audio_url} type="audio/mpeg" />
                </audio>
              )}

              {selectedQuestion.image_url && (
                <img src={selectedQuestion.image_url} alt="Question" />
              )}

              <div className="mt-4 space-y-2">
                {["A", "B", "C", "D"].map((option) => {
                  const partData = submittedData?.parts?.find(
                    (p: any) => p.part_number === Number(part_number)
                  );

                  const questionIndex = data.questions.findIndex(
                    (q) => q.id === selectedQuestion?.id
                  );

                  const currentAnswer =
                    questionIndex !== -1
                      ? partData?.answers?.[questionIndex]
                      : null;
                  const userAnswer = currentAnswer?.user_answer || "";
                  const correctAnswer = currentAnswer?.correct_answer || "";

                  return (
                    <div
                      key={option}
                      className={`p-2 border rounded-lg flex items-center justify-between ${
                        userAnswer === option
                          ? userAnswer === correctAnswer
                            ? "border-green-500 bg-green-100"
                            : "border-red-500 bg-red-100"
                          : ""
                      }`}
                    >
                      <span>
                        ({option}).{" "}
                        {
                          selectedQuestion?.[
                            `option_${option.toLowerCase()}` as keyof IQuestion
                          ]
                        }
                      </span>

                      {correctAnswer === option ? (
                        <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-2xl">
                          Đáp án đúng
                        </span>
                      ) : userAnswer === option ? (
                        <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-2xl">
                          Bạn đã chọn
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Chọn một câu hỏi để xem chi tiết.
            </p>
          )}
        </div>

        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg mb-2">Part {data.exam_section.part_number}</h3>
          <div className="grid grid-cols-4 gap-2">
            {data.questions.map((q, index) => {
              const partData = submittedData?.parts?.find(
                (p: any) => p.part_number === Number(part_number)
              );
              const userAnswer = partData?.answers?.[index]?.user_answer || "";
              const correctAnswer =
                partData?.answers?.[index]?.correct_answer || "";
              const isCorrect = userAnswer === correctAnswer;

              return (
                <button
                  key={q.id}
                  className={`p-1 text-center rounded border-2 w-[90px] cursor-pointer ${
                    isCorrect
                      ? "border-[#D6F5BE] bg-[#F6FFED]"
                      : "border-[#FFA39E] bg-[#FFF1F0]"
                  }`}
                  onClick={() => setSelectedQuestion(q)}
                >
                  {q.question_number}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
