import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Modal, Radio } from "antd";
import {
  getListQuestionTest,
  IQuestion,
} from "@/api/client/get-list-question-in-test.api";
import { useLocation } from "react-router-dom";
import { IGetListTest } from "@/api/client/get-list-test.api";

export default function ExamLayout() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string | null>
  >({});
  const loadingRef = useRef<boolean>(false);
  const location = useLocation();
  const testData = location.state as IGetListTest;
  const [timeLeft, setTimeLeft] = useState<number>(testData.duration * 60);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
    if (loadingRef.current) return;
    loadingRef.current = true;

    getListQuestionTest(
      testData.exam_code,
      Number(testData.part_number)
    ).subscribe({
      next: (res) => {
        setQuestions(res.questions);
        loadingRef.current = false;

        setSelectedAnswers({});
      },
      error: () => {
        loadingRef.current = false;
      },
    });
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const audioElement = document.getElementById(
      "audioElement"
    ) as HTMLAudioElement;
    if (audioElement && currentQuestion?.audio_url) {
      audioElement.src = currentQuestion.audio_url;
      audioElement.load();
      audioElement.play();
    }
  }, [currentQuestionIndex, currentQuestion?.audio_url]);

  const handleSelectAnswer = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center bg-gray-800 text-white p-4">
        <h1 className="font-bold text-lg">Lớp TOEIC Thầy Long</h1>
        <div className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-4">
          {/* <Button
            type="default"
            color="purple"
            variant="solid"
            size="large"
            shape="round"
          >
            Xuất kết quả PDF
          </Button> */}
          <Button size="large" shape="round">
            {currentQuestionIndex + 1}/{questions.length}
          </Button>
          <Button
            type="default"
            size="large"
            color="red"
            variant="solid"
            shape="round"
          >
            Time: {formatTime(timeLeft)}
          </Button>
          <Button type="primary" shape="round" size="large">
            Nộp bài
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r p-4 space-y-4 overflow-y-auto">
          <h2 className="font-bold">Question {currentQuestionIndex + 1}</h2>
          {currentQuestion?.audio_url && (
            <audio id="audioElement" controls autoPlay className="w-full">
              <source src={currentQuestion.audio_url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          )}
          {currentQuestion?.image_url && (
            <div className="text-center">
              <img
                src={currentQuestion.image_url}
                className="mx-auto w-2/3 h-auto"
              />
            </div>
          )}
        </div>

        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            Question {currentQuestionIndex + 1}:{" "}
            {currentQuestion?.question_text}
          </h2>
          <Radio.Group
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            value={selectedAnswers[currentQuestionIndex] || null}
            onChange={(e) => handleSelectAnswer(e.target.value)}
          >
            {currentQuestion &&
              (Number(testData.part_number) === 2
                ? ["A", "B", "C"]
                : ["A", "B", "C", "D"]
              ).map((option) => (
                <label
                  key={option}
                  className="border border-gray-300 px-4 py-3 rounded flex items-center h-14 hover:border-black cursor-pointer transition-colors"
                >
                  <Radio value={option} className="pointer-events-none" />
                  <span className="ml-3 text-base">({option}) </span>
                </label>
              ))}
          </Radio.Group>
        </div>

        <div className="w-1/3 p-4 overflow-y-auto flex flex-col space-y-4">
          <h3 className="font-bold">Part {testData.part_number}</h3>
          <div className="grid grid-cols-6 gap-2">
            {questions.map((_, index) => {
              const isAnswered = !!selectedAnswers[index];
              const isCurrent = index === currentQuestionIndex;

              return (
                <Button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  style={{
                    border: "1px solid",
                    borderColor: isCurrent
                      ? "#91D5FF"
                      : isAnswered
                      ? "#B7EB8F"
                      : "gray",
                    backgroundColor: isCurrent
                      ? "#E6F7FF"
                      : isAnswered
                      ? "#F6FFED"
                      : "white",
                    color: "black",
                    transition: "border-color 0.2s ease-in-out",
                  }}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="flex justify-center gap-7 p-4 bg-white border-t">
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
        >
          Câu trước
        </Button>
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
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
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
            Đồng ý
          </Button>,
        ]}
      >
        <p>Bạn đã hoàn thành bài thi này!</p>
      </Modal>
    </div>
  );
}
