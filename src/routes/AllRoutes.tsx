import HomePage from "@/pages/client/homepage";
import ForgotPassword from "@/pages/normal/forgot-password";
import LoginPage from "@/pages/normal/login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
export const AllRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/auth/login",
      element: <LoginPage />,
    },
    {
      path: "/auth/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AllRoutes;
