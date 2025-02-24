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
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Tổng hợp đề thi</h1>
      <div className="flex items-center gap-4 flex-wrap mb-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            type={activeFilter === filter ? "primary" : "default"}
            className={`rounded-full ${
              activeFilter === filter ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nhập tên đề muốn tìm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1"
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Filter;
