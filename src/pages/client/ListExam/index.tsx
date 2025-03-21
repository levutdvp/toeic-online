import {
  getTestFull,
  IGetListTestFull,
} from "@/api/client/get-list-test-full.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading, showLoading } from "@/services/loading";
import { TableQueriesRef } from "@/types/pagination.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type TableQueries = TableQueriesRef<IGetListTestFull>;

const TestCard: React.FC<IGetListTestFull> = ({
  title,
  duration,
  parts,
  questions,
  maxScore,
  label,
  isFree,
}) => {
  const linkTo = `/contest/${title.replace(/\s+/g, "")}`;
  const state = { title, duration, parts, questions, maxScore, label, isFree };

  return (
    <Link to={linkTo} state={state} className="block w-full max-w-[700px]">
      <div className="relative bg-white border border-gray-300 rounded-lg p-5 transition-all duration-300 hover:border-blue-500 shadow-sm w-full cursor-pointer">
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
          <div className="bg-[#404040] text-white px-3 py-1 rounded w-fit">
            Làm bài
          </div>
        </div>
      </div>
    </Link>
  );
};

const transformTestData = (data: any[]): IGetListTestFull[] => {
  return data.map((item) => ({
    ...item,
    isFree: item.isFree === 0,
  }));
};

const ListExam: React.FC = () => {
  const [testData, setTestData] = useState<IGetListTestFull[]>([]);

  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
  });

  const getListTest = useCallback(() => {
    showLoading();
    const getListTestSub = getTestFull({
      pageNumber: tableQueriesRef.current.current,
      pageSize: tableQueriesRef.current.pageSize,
    }).subscribe({
      next: (res) => {
        const transformedData = transformTestData(res.data);
        setTestData(transformedData);
        tableQueriesRef.current = {
          ...tableQueriesRef.current,
          current: res.meta.pageCurrent,
          pageSize: res.meta.pageSize,
          totalPage: res.meta.totalPage,
          total: res.meta.total,
        };
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
