import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Subscription } from "rxjs";
import { getListQuestionTest, IGetListQuestionTest, IQuestion } from "@/api/client/get-list-question-in-test.api";
import { removeLoading } from "@/services/loading";

const ExamResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exam_code, part_number } = location.state || {}

  const [data, setData] = useState<IGetListQuestionTest | null>(null);

  useEffect(() => {
    let subscription: Subscription;

    if (exam_code && part_number) {
      subscription = getListQuestionTest(exam_code, Number(part_number)).subscribe({
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


  if (!data) return <p className="text-center text-red-500">Không có dữ liệu!</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg">
        <Button type="text" className="text-white" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <h2 className="text-lg font-semibold">
          Test exam {data.exam_section.exam_name} - Part {data.exam_section.part_number}
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-6">
        {/* Sidebar */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <FlagOutlined className="text-xl text-yellow-500" />
            <h3 className="text-xl font-bold">Điểm</h3>
          </div>
          <p className="text-4xl font-bold text-center mt-2">--</p>
          <Card className="mt-4 text-center">
            <p className="font-semibold">Listening Part {data.exam_section.part_number}:</p>
            <p className="text-lg">{data.questions.length} câu hỏi</p>
          </Card>
        </div>

        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold">Câu {data.questions[0].question_number}</h3>

          {data.questions[0].audio_url && (
            <audio controls className="mt-2">
              <source src={data.questions[0].audio_url} type="audio/mpeg" />
            </audio>
          )}

          {data.questions[0].image_url && (
            <img src={data.questions[0].image_url} alt="Question" className="mt-4 rounded-lg border" />
          )}

          <div className="mt-4 space-y-2">
            {["A", "B", "C", "D"].map((option) => (
              <div key={option} className="p-2 border rounded-lg flex justify-between">
                <span>{option}. {data.questions[0][`option_${option.toLowerCase()}` as keyof IQuestion]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Part {data.exam_section.part_number}</h3>
          <div className="grid grid-cols-3 gap-2">
            {data.questions.map((q) => (
              <div key={q.id} className="p-2 text-center bg-gray-200 rounded">{q.question_number}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
