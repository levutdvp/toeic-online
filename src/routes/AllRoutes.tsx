import HomePage from "@/pages/client/homepage";
import ForgotPassword from "@/pages/normal/forgot-password";
import LoginPage from "@/pages/normal/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Profile from "@/pages/admin/profile";
import Dashboard from "@/pages/admin/dashboard";
import { rolesAllowedAdmin } from "@/consts/permission.const";
import StudentsTablesPage from "@/pages/admin/tables/StudentsTablePage";
import ClassTablesPage from "@/pages/admin/tables/ClassTablePage";
import DetailTest from "@/pages/client/ListExam/Detail-Test";
import DefaultLayout from "@/components/common/defaultLayout";
import UserTablesPage from "@/pages/admin/tables/UsersTablePage";
import ResetPassword from "@/pages/normal/reset-password";
import TestComponent from "@/pages/client/ListExam/Detail-Test/Contest";
import { ConfigProvider } from "antd";
import ExcelUploadPart1 from "@/pages/admin/forms/ExcelExam/Part1";
import ExcelUploadPart2 from "@/pages/admin/forms/ExcelExam/Part2";
import ExcelUploadPart3 from "@/pages/admin/forms/ExcelExam/Part3";
import ExcelUploadPart4 from "@/pages/admin/forms/ExcelExam/Part4";
import ExcelUploadPart5 from "@/pages/admin/forms/ExcelExam/Part5";
import ExcelUploadPart6 from "@/pages/admin/forms/ExcelExam/Part6";
import ExcelUploadPart7 from "@/pages/admin/forms/ExcelExam/Part7";
import ExamTablePage from "@/pages/admin/tables/ExamTablePage";
import ExamResultPage from "@/pages/client/ListExam/Detail-Test/Contest/ExamResult";
import TeachersTablePage from "@/pages/admin/tables/TeachersTablePage";

export const AllRoutes = () => {
  const router = createBrowserRouter([
    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/forgot-password", element: <ForgotPassword /> },
    { path: "/auth/reset-password", element: <ResetPassword /> },
    {
      path: "/",
      element: (
        <DefaultLayout isDefaultLayout={false}>
          <HomePage />
        </DefaultLayout>
      ),
    },
    {
      path: "/practice",
      element: (
        <DefaultLayout isDefaultLayout={false}>
          <HomePage />
        </DefaultLayout>
      ),
    },
    {
      path: "/contest/:contestId",
      element: (
        <DefaultLayout isDefaultLayout={false}>
          <DetailTest />
        </DefaultLayout>
      ),
    },
    {
      path: "/test",
      element: (
        <DefaultLayout isDefaultLayout={false}>
          <ConfigProvider theme={{ hashed: false }}>
            <TestComponent />
          </ConfigProvider>
        </DefaultLayout>
      ),
    },
    {
      path: "/test/result",
      element: (
        <DefaultLayout isDefaultLayout={false}>
          <ExamResultPage />
        </DefaultLayout>
      ),
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute
          element={<DefaultLayout />}
          requiredRoles={rolesAllowedAdmin}
        ></PrivateRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "all-users", element: <UserTablesPage /> },
        { path: "users-teacher", element: <TeachersTablePage /> },
        // { path: "users-teacher/:teacherId", element: <TeacherDetail /> },
        { path: "users-student", element: <StudentsTablesPage /> },
        { path: "classes", element: <ClassTablesPage /> },
        // { path: "classes/detail", element: <DetailClass /> },
        { path: "exams", element: <ExamTablePage /> },
        { path: "exams/part1", element: <ExcelUploadPart1 /> },
        { path: "exams/part2", element: <ExcelUploadPart2 /> },
        { path: "exams/part3", element: <ExcelUploadPart3 /> },
        { path: "exams/part4", element: <ExcelUploadPart4 /> },
        { path: "exams/part5", element: <ExcelUploadPart5 /> },
        { path: "exams/part6", element: <ExcelUploadPart6 /> },
        { path: "exams/part7", element: <ExcelUploadPart7 /> },
        { path: "profile", element: <Profile /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AllRoutes;
