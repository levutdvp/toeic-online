import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListExam from "../ListExam";
import Filter from "@/components/Filter";
// import useRedirectIfNotAuthenticated from "@/hooks/use-check-not-auth.hook";

const HomePage = () => {
  // useRedirectIfNotAuthenticated();
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
