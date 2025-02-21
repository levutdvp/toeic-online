import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/normal/Login";
import HomePage from "../pages/client/homepage";
export const AllRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AllRoutes;
