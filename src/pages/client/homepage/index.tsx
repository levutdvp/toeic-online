import Footer from "@/components/client/Footer";
import Header from "@/components/client/Header";
import Filter from "@/components/client/Filter";
import ListExam from "../ListExam";

const HomePage = () => {
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
