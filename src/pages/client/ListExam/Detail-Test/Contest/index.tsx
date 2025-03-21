import { useEffect, useState } from "react";
import { Button, Radio } from "antd";
import "./index.css";

export default function ExamLayout() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  const renderButtons = (start: number, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const questionNumber = start + i;
      return (
        <Button
          key={questionNumber}
          type={questionNumber === currentQuestion ? "primary" : "default"}
          onClick={() => setCurrentQuestion(questionNumber)}
        >
          {questionNumber}
        </Button>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center bg-gray-800 text-white p-4">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-lg">Lớp TOEIC Thầy Long</h1>
        </div>
        <div className="text-lg font-semibold">
          Listening: Question {currentQuestion} of 200
        </div>
        <div className="flex items-center gap-4">
          <Button color="purple" variant="solid" shape="round" size="large">
            Xuất kết quả PDF
          </Button>
          <Button
            shape="round"
            className="text-black bg-white rounded px-2 py-1"
            size="large"
          >
            {currentQuestion}/200
          </Button>
          <Button color="red" variant="solid" shape="round" size="large">
            Time: {formatTime(timeLeft)}
          </Button>
          <Button type="primary" shape="round" size="large">
            Nộp bài
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center space-x-2">
            <div className=" font-bold">Question {currentQuestion}</div>
            <div className="text-red-500">🚩</div>
          </div>
          <audio controls className="w-full">
            <source src="/audio.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <div className="text-center">
            <img src="/placeholder.jpg" className="mx-auto w-2/3 h-auto" />
          </div>
        </div>

        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Question {currentQuestion}</h2>
          <Radio.Group
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {["A", "B", "C", "D"].map((option) => (
              <label
                key={option}
                className="border border-gray-300 px-4 py-3 rounded flex items-center h-14 hover:border-black cursor-pointer transition-colors"
              >
                <Radio value={option} className="pointer-events-none" />
                <span className="ml-3 text-base">({option})</span>
              </label>
            ))}
          </Radio.Group>
        </div>

        <div className="w-1/3 p-4 overflow-y-auto flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-green-600 rounded-full"></span>
              <span className="text-green-600 text-sm">
                Câu hỏi đã hoàn thành
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
              <span className="text-orange-500 text-sm">
                Câu hỏi cần xem lại
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-blue-600 text-sm">Câu hỏi hiện tại</span>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto">
            {/* Part 1 */}
            <div>
              <h3 className="font-bold">Part 1</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(1, 6)}
              </div>
            </div>

            {/* Part 2 */}
            <div>
              <h3 className="font-bold">Part 2</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(7, 25)}
              </div>
            </div>

            {/* Part 3 */}
            <div>
              <h3 className="font-bold">Part 3</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(32, 39)}
              </div>
            </div>

            {/* Part 4 */}
            <div>
              <h3 className="font-bold">Part 4</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(71, 30)}
              </div>
            </div>

            {/* Part 5 */}
            <div>
              <h3 className="font-bold">Part 5</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(101, 30)}
              </div>
            </div>

            {/* Part 6 */}
            <div>
              <h3 className="font-bold">Part 6</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(131, 16)}
              </div>
            </div>

            {/* Part 7 */}
            <div>
              <h3 className="font-bold">Part 7</h3>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {renderButtons(147, 54)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center gap-7 p-4 bg-white border-t">
        <Button
          onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 1))}
          size="large"
          shape="round"
          color="default"
          variant="solid"
        >
          Câu trước
        </Button>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, 200))}
        >
          Câu tiếp
        </Button>
      </footer>
    </div>
  );
}
