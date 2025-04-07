import { useAuth } from "@/hooks/use-auth.hook";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListExam from "../ListExam";
import { PageWrapper } from "../PageWrapper";

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
        <ListExam isPractice={isPractice} />
      </PageWrapper>
    </>
  );
};

export default HomePage;
