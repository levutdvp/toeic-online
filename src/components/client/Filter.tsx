import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Input, Button } from "antd";
import { getListExam, IGetListTest } from "@/api/client/get-list-test.api";

const Filter: React.FC = () => {
  // const [searchText, setSearchText] = useState<string>("");
  // const [examList, setExamList] = useState<IGetListTest[]>([]);
  const [filteredExams, setFilteredExams] = useState<IGetListTest[]>([]);
  const loadingRef = useRef<boolean>(false); 

  const fetchExamList = useCallback(() => {
    if (loadingRef.current) return; 
    loadingRef.current = true;
    console.log(filteredExams)

    getListExam({ pageNumber: 1, pageSize: 50 }).subscribe({
      next: (response) => {
        // setExamList(response.data); 
        setFilteredExams(response.data); 
        loadingRef.current = false;
      },
      error: (err) => {
        console.error("Lỗi khi tải danh sách đề thi:", err);
        loadingRef.current = false;
      },
    });
  }, []);

  useEffect(() => {
    fetchExamList();
  }, [fetchExamList]);
  // const handleSearch = () => {
  //   const filtered = examList.filter((exam) =>
  //     exam.exam_name.toLowerCase().includes(searchText.toLowerCase())
  //   );
  //   setFilteredExams(filtered); 
  // };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-5xl font-sans ml-[200px]">Tổng hợp đề thi</h1>
      {/* <div className="flex gap-2 max-w-[1000px] ml-[200px]">
        <Input
          placeholder="Nhập tên đề muốn tìm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1"
          size="large"
        />
        <Button
          size="large"
          type="primary"
          className="px-6 py-2 rounded-md"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div> */}
    </div>
  );
};

export default Filter;
