import Footer from "../../components/client/Footer";
import Header from "../../components/client/Header";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
