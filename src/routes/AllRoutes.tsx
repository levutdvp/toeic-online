import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/normal/login";
import HomePage from "../pages/client/homepage";
import ForgotPassword from "../pages/normal/forgot-password";
export const AllRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/auth/login",
      element: <Login />,
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
