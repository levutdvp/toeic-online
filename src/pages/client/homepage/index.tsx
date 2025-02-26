import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListExam from "../ListExam";
import Filter from "@/components/Filter";

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
