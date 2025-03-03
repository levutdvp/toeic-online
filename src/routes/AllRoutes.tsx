import HomePage from "@/pages/client/homepage";
import ForgotPassword from "@/pages/normal/forgot-password";
import LoginPage from "@/pages/normal/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Forms from "@/pages/admin/forms";
import Profile from "@/pages/admin/profile";
import Layout from "@/components/admin/Layout";
import Dashboard from "@/pages/admin/dashboard";
import {
  rolesAllowedAdmin,
  rolesAllowedClient,
} from "@/consts/permission.const";
import EditForm from "@/pages/admin/forms/EditForm";
import Tables from "@/pages/admin/tables/TeachersTablePage";
import UserTablesPage from "@/pages/admin/tables/UsertablePage";
import StudentsTablesPage from "@/pages/admin/tables/StudentsTablePage";
import ClassTablesPage from "@/pages/admin/tables/ClassTablePage";

export const AllRoutes = () => {
  const router = createBrowserRouter([
    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/forgot-password", element: <ForgotPassword /> },
    {
      path: "/",
      element: (
        <PrivateRoute
          element={<HomePage />}
          requiredRoles={rolesAllowedClient}
        />
      ),
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute
          element={<Layout />}
          requiredRoles={rolesAllowedAdmin}
        ></PrivateRoute>
      ),
      children: [
        { index: true, element: <PrivateRoute element={<Dashboard />} /> },
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
