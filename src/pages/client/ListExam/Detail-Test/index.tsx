import { Button, Card, Tag, Alert } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Header from "@/components/client/Header";
import Footer from "@/components/client/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { IGetListTest } from "@/api/client/get-list-test.api";

const TestDetail = () => {
  const location = useLocation();
  const testData = location.state as IGetListTest;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center flex-grow">
        <Card className="w-[800px] p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {testData?.exam_name}
          </h2>
          <div className="flex justify-center gap-2 mb-4">
            {testData?.is_Free ? (
              <Tag color="gold">Miễn phí</Tag>
            ) : (
              <Tag color="purple">Cho học viên</Tag>
            )}

            <Tag color="gray">{testData?.type}</Tag>
          </div>
          <div className="text-center text-gray-700">
            <p>
              Thời gian: <strong>{testData?.duration}</strong> phút
            </p>
            <p>
              Phần thi: <strong>Part {testData?.part_number}</strong>
            </p>
            <p>
              Câu hỏi: <strong>{testData?.question_count}</strong> câu
            </p>
            <p>
              Điểm tối đa: <strong>{testData?.max_score}</strong> điểm
            </p>
          </div>
          <Alert
            message="Lưu ý"
            description={
              <div>
                <p>
                  <strong>
                    Hãy sử dụng trình duyệt{" "}
                    <a
                      href="https://www.google.com/chrome/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      Google Chrome
                    </a>{" "}
                    để làm Test
                  </strong>
                </p>
                <p>
                  Nhập mã code hoặc đăng nhập để bắt đầu làm bài thi, mã code
                  được các thầy cô cung cấp trên lớp học.
                </p>
                <p>
                  Ngoài ra bạn có thể sử dụng tài khoản do Lớp TOEIC thầy Long
                  cung cấp để làm bài!
                </p>
              </div>
            }
            type="warning"
            className="mt-4 mb-6 bg-yellow-50 border-yellow-200 text-yellow-700"
          />
          <div className="flex justify-center gap-4 mt-4">
            {/* <Button
              shape="round"
              type="primary"
              size="large"
              icon={<BiSolidEdit />}
            >
              Bắt đầu thi thử
            </Button> */}
            <Button
              shape="round"
              size="large"
              icon={<EditOutlined />}
              onClick={() => navigate("/test", { state: testData })}
              className="bg-black text-white"
            >
              Luyện tập
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TestDetail;
