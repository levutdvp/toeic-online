import React, { useState } from "react";
import { Input, Button } from "antd";
import "antd/dist/reset.css";

const Filter: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [searchText, setSearchText] = useState<string>("");

  const filters = [
    "Tất cả",
    "ĐỀ 2024",
    "ĐỀ 2023",
    "ĐỀ 2022",
    "ĐỀ 2020",
    "ĐỀ ACTUAL TESTS",
    "ĐỀ ALL NEW",
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearch = () => {};

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-5xl font-sans ml-[200px]">Tổng hợp đề thi</h1>
      <div className="flex ml-[200px] gap-6 flex-wrap mb-6">
        {filters.map((filter) => (
          <Button
            shape="round"
            key={filter}
            type={activeFilter === filter ? "primary" : "default"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="flex gap-2 max-w-[1000px] ml-[200px]">
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
      </div>
    </div>
  );
};

export default Filter;
