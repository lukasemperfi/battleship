import { GamePage } from "@/pages/GamePage";
import { createHashRouter, RouterProvider } from "react-router-dom";

export const AppRouter = () => {
  const routes = [
    {
      path: "/",
      element: <GamePage />,
    },
  ];

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
};
