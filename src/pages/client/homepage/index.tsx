import Filter from "@/components/client/Filter";
import ListExam from "../ListExam";
import { useAuth } from "@/hooks/use-auth.hook";
import { useLocation, useNavigate } from "react-router-dom";
import { PageWrapper } from "../PageWrapper";
import { useEffect, useMemo } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  if (!userInfo) {
    navigate("/auth/login");
  }

  const pathname = useLocation();

  const isPractice = useMemo(() => {
    return pathname.pathname === "/practice";
  }, [pathname]);

  useEffect(() => {
    if (isPractice) {
      navigate("/practice");
    }
  }, [isPractice]);

  return (
    <>
      <PageWrapper>
        <Filter />
        <ListExam isPractice={isPractice} />
      </PageWrapper>
    </>
  );
};

export default HomePage;
