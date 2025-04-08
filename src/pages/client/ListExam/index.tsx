import { getTestFull } from "@/api/client/get-list-test-full.api";
import { getListExam, IGetListTest } from "@/api/client/get-list-test.api";
import { IGetListTestFull } from "@/api/client/get-list-test-full.api";
import { initPaging } from "@/consts/paging.const";
import { removeLoading } from "@/services/loading";
import { TableQueriesRef } from "@/types/pagination.type";
import { Pagination, Input, Button } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Observable } from "rxjs";

type TableQueries = TableQueriesRef<IGetListTest>;

const TestCard: React.FC<IGetListTest> = ({
  exam_code,
  exam_name,
  duration,
  part_number,
  section_name,
  question_count,
  max_score,
  type,
  is_Free,
}) => {
  const linkTo = `/contest/${exam_name?.replace(/\s+/g, "")}`;
  const state = {
    exam_code,
    exam_name,
    duration,
    part_number,
    section_name,
    question_count,
    max_score,
    type,
    is_Free,
  };

  return (
    <Link to={linkTo} state={state} className="block w-full max-w-[700px]">
      <div className="relative bg-white border border-gray-300 rounded-lg p-5 transition-all duration-300 hover:border-blue-500 shadow-sm w-full cursor-pointer">
        {is_Free ? (
          <div>
            <span className="absolute top-2 right-[-15px] bg-[#A98472] text-white text-center px-2 py-1 rounded-[3px] w-[80px] shadow-md">
              Miễn phí
            </span>
            <div className=" absolute w-0 h-0 border-t-[12px] border-t-[#7F6355] border-r-[12px] border-r-transparent top-[40px] right-[-13px]"></div>
          </div>
        ) : (
          <div>
            <span className="absolute top-2 right-[-15px] bg-[#722ED1] text-white text-center px-2 py-1 rounded-[3px] w-[110px] shadow-md">
              Cho học viên
            </span>
            <div className=" absolute w-0 h-0 border-t-[12px] border-t-[#55229D] border-r-[12px] border-r-transparent top-[40px] right-[-13px]"></div>
          </div>
        )}

        <h3 className="font-bold text-lg">{exam_name}</h3>

        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div>
            <p>
              Thời gian: <b>{duration}</b> phút
            </p>
            <p>
              Phần thi:{" "}
              <b>
                {Number(part_number) === 0 ? "Full" : `Part ${part_number}`}
              </b>
            </p>
          </div>
          <div>
            <p>
              Câu hỏi: <b>{question_count}</b> câu
            </p>
            <p>
              Điểm tối đa: <b>{max_score}</b> điểm
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded mb-3 font-bold">
            {type}
          </div>
          <div className="bg-[#404040] text-white px-3 py-1 rounded w-fit">
            Làm bài
          </div>
        </div>
      </div>
    </Link>
  );
};

const ListExam: React.FC<{ isPractice: boolean }> = ({ isPractice }) => {
  const [testData, setTestData] = useState<IGetListTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTestData, setAllTestData] = useState<IGetListTest[]>([]);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const tableQueriesRef = useRef<TableQueries>({
    current: initPaging.pageCurrent,
    pageSize: initPaging.pageSize,
    totalPage: initPaging.totalPage,
    total: initPaging.total,
  });

  const getListTest = useCallback(() => {
    const getList = isPractice ? getListExam : getTestFull;
    (
      getList({
        pageNumber: tableQueriesRef.current.current,
        pageSize: tableQueriesRef.current.pageSize,
      }) as Observable<any>
    ).subscribe({
      next: (res) => {
        const transformedData = isPractice
          ? res.data.map((item: IGetListTest) => ({
              ...item,
              is_Free: Boolean(item.is_Free),
            }))
          : res.data.map((item: IGetListTestFull) => ({
              ...item,
              is_Free: Boolean(item.isFree),
              type: "Thi thử",
            }));
        setTestData(transformedData);
        setAllTestData(transformedData);
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
  }, [isPractice]);

  useEffect(() => {
    getListTest();
  }, [getListTest]);

  const filterData = useCallback(() => {
    let filteredData = [...allTestData];

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((test) =>
        test.exam_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by part
    if (selectedPart !== null) {
      filteredData = filteredData.filter(
        (test) => Number(test.part_number) === selectedPart
      );
    }

    setTestData(filteredData);
  }, [searchTerm, selectedPart, allTestData]);

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedPart, filterData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePartSelect = (part: number) => {
    setSelectedPart(part === selectedPart ? null : part);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    tableQueriesRef.current.current = page;
    if (pageSize) tableQueriesRef.current.pageSize = pageSize;
    getListTest();
  };

  return (
    <>
      <div>
        <div className="bg-[#F5F5F7] p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 mr-[200px] ml-[200px]">
            Tổng hợp đề thi
          </h2>
          {isPractice && (
            <div className="flex gap-2 mb-4 mr-[200px] ml-[200px]">
              {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                <Button
                  key={part}
                  type={selectedPart === part ? "primary" : "default"}
                  onClick={() => handlePartSelect(part)}
                  className={selectedPart === part ? "bg-blue-500" : ""}
                  shape="round"
                >
                  Part {part}
                </Button>
              ))}
              <Button
                type={selectedPart === null ? "primary" : "default"}
                onClick={() => setSelectedPart(null)}
                className={selectedPart === null ? "bg-blue-500" : ""}
                shape="round"
              >
                Tất cả
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tên đề muốn tìm..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="!max-w-[800px] !ml-[200px]"
            />
            <Button
              type="primary"
              className="bg-gray-800"
              onClick={() => handleSearch(searchTerm)}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="p-5 mr-[200px] ml-[200px]">
        <div className="grid grid-cols-2 gap-6">
          {testData.map((test, index) => (
            <TestCard
              key={index}
              {...test}
              type={isPractice ? "Luyện tập" : test.type}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            current={tableQueriesRef.current.current}
            pageSize={tableQueriesRef.current.pageSize}
            total={tableQueriesRef.current.total}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default ListExam;
