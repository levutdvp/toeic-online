import HomePage from "@/pages/client/homepage";
import ForgotPassword from "@/pages/normal/forgot-password";
import LoginPage from "@/pages/normal/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Forms from "@/pages/admin/forms";
import Profile from "@/pages/admin/profile";
import Dashboard from "@/pages/admin/dashboard";
import { rolesAllowedAdmin } from "@/consts/permission.const";
import EditForm from "@/pages/admin/forms/EditForm";
import Tables from "@/pages/admin/tables/TeachersTablePage";
import StudentsTablesPage from "@/pages/admin/tables/StudentsTablePage";
import ClassTablesPage from "@/pages/admin/tables/ClassTablePage";
import DetailTest from "@/pages/client/ListExam/Detail-Test";
import UserTablesPage from "@/pages/admin/tables/UsertablePage";
import DefaultLayout from "@/components/common/defaultLayout";

export const AllRoutes = () => {
  const router = createBrowserRouter([
    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/forgot-password", element: <ForgotPassword /> },
    {
      path: "/",
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
      path: "/admin",
      element: (
        <PrivateRoute
          element={<DefaultLayout />}
          requiredRoles={rolesAllowedAdmin}
        ></PrivateRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "forms", element: <Forms /> },
        { path: "all-users", element: <UserTablesPage /> },
        { path: "users-teacher", element: <Tables /> },
        { path: "users-student", element: <StudentsTablesPage /> },
        { path: "classes", element: <ClassTablesPage /> },
        { path: "edit-form", element: <EditForm /> },
        { path: "profile", element: <Profile /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AllRoutes;
