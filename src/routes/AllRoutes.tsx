import HomePage from "@/pages/client/homepage";
import ForgotPassword from "@/pages/normal/forgot-password";
import LoginPage from "@/pages/normal/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Forms from "@/pages/admin/forms";
import Tables from "@/pages/admin/tables";
import UsersTable from "@/pages/admin/tables/UserTable";
import Profile from "@/pages/admin/profile";
import Layout from "@/components/admin/Layout";
import Dashboard from "@/pages/admin/dashboard";
import {
  rolesAllowedAdmin,
  rolesAllowedClient,
} from "@/consts/permission.const";
// import EditForm from "@/pages/admin/forms/EditForm";
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
        <PrivateRoute element={<Layout />} requiredRoles={rolesAllowedAdmin} />
      ),
    },
    {
      path: "/admin",
      index: true,
      element: (
        <PrivateRoute
          element={<Dashboard />}
          requiredRoles={rolesAllowedAdmin}
        />
      ),
    },
    { path: "/forms", element: <Forms /> },
    // { path: "/edit-form", element: <EditForm /> },
    { path: "/tables", element: <Tables /> },
    { path: "/users-table", element: <UsersTable /> },
    { path: "/profile", element: <Profile /> },
  ]);
  return <RouterProvider router={router} />;
};

export default AllRoutes;
