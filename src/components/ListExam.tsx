import React from "react";

const exams = [
  { title: "Đề 2024 Test 1", category: "ĐỀ 2024" },
  { title: "Đề 2023 Test 2", category: "ĐỀ 2023" },
  { title: "Đề ALL NEW Test 1", category: "ĐỀ ALL NEW" },
  { title: "Đề ACTUAL TEST 1", category: "ĐỀ ACTUAL TESTS" },
  { title: "Đề 2020 Test 1", category: "ĐỀ 2020" },
  { title: "Đề 2024 Test 2", category: "ĐỀ 2024" },
];

const ListExam = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Tổng hợp đề thi</h1>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Tất cả
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded">ĐỀ 2024</button>
          <button className="px-4 py-2 bg-gray-200 rounded">ĐỀ 2023</button>
        </div>
        <input
          type="text"
          placeholder="Nhập tên đề muốn tìm..."
          className="w-full p-2 border rounded mb-6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <div key={index} className="bg-white p-4 rounded shadow relative">
              <span className="absolute top-2 right-2 bg-brown-300 text-white px-2 py-1 text-xs rounded">
                Free
              </span>
              <h2 className="text-lg font-semibold">{exam.title}</h2>
              <p className="text-gray-500">Thời gian: 120 phút</p>
              <p className="text-gray-500">Câu hỏi: 200 câu</p>
              <button className="mt-4 px-4 py-2 bg-black text-white rounded">
                Làm bài
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListExam;
