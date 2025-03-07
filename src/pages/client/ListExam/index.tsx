import { getTestFull } from "@/api/client/get-list-test-full.api";
import { removeLoading, showLoading } from "@/services/loading";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TestProps {
  title: string;
  duration: number;
  parts: number;
  questions: number;
  maxScore: number;
  label: string;
  isFree?: boolean;
}

const TestCard: React.FC<TestProps> = ({
  title,
  duration,
  parts,
  questions,
  maxScore,
  label,
  isFree,
}) => (
  <div className="relative bg-white border border-gray-300 rounded-lg p-5 transition-all duration-300 hover:border-blue-500 shadow-sm w-full max-w-[700px] cursor-pointer">
    {isFree && (
      <div>
        <span className="absolute top-2 right-[-15px] bg-[#A98472] text-white text-center px-2 py-1 rounded-[3px] w-[60px] shadow-md ">
          Free
        </span>
        <div className=" absolute w-0 h-0 border-t-[12px] border-t-[#7F6355] border-r-[12px] border-r-transparent top-[40px] right-[-13px]"></div>
      </div>
    )}

    <h3 className="font-bold text-lg">{title}</h3>

    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
      <div>
        <p>
          Thời gian: <b>{duration}</b> phút
        </p>
        <p>
          Phần thi: <b>{parts}</b> phần
        </p>
      </div>
      <div>
        <p>
          Câu hỏi: <b>{questions}</b> câu
        </p>
        <p>
          Điểm tối đa: <b>{maxScore}</b> điểm
        </p>
      </div>
    </div>
    <div className="flex flex-col items-start">
      <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded mb-3 font-bold">
        {label}
      </div>
      <Link
        to={`/contest/${title.replace(/\s+/g, "")}`}
        className="bg-[#404040] text-white px-3 py-1 rounded"
      >
        Làm bài
      </Link>
    </div>
  </div>
);

const transformTestData = (data: any[]): TestProps[] => {
  return data.map((item) => ({
    ...item,
    isFree: item.isFree === 0,
  }));
};

const ListExam: React.FC = () => {
  const [testData, setTestData] = useState<TestProps[]>([]);

  const getListTest = useCallback(() => {
    showLoading();
    const getListTestSub = getTestFull().subscribe({
      next: (res) => {
        const transformedData = transformTestData(res.data);
        setTestData(transformedData);
        removeLoading();
      },
      error: () => {
        removeLoading();
      },
    });
    getListTestSub.add();
  }, []);

  useEffect(() => {
    getListTest();
  }, [getListTest]);

  return (
    <div className="p-5 grid grid-cols-2 gap-6 place-items-center mr-[200px] ml-[200px]">
      {testData.map((test, index) => (
        <TestCard key={index} {...test} />
      ))}
    </div>
  );
};

export default ListExam;
