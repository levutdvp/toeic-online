import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";
import Filter from "@/components/client/Filter";
import ListExam from "../ListExam";
import { useAuth } from "@/hooks/use-auth.hook";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  if (!userInfo) {
    navigate("/auth/login");
  }

  return (
    <>
      <Header />
      <Filter />
      <ListExam />
      <Footer />
    </>
  );
};

export default HomePage;
