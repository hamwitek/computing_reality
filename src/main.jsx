import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AboutPage from "./pages/About.jsx";
import StartPage from "./pages/StartPage.jsx";
import ProjectStart from "./pages/ProjectStart.jsx";
import HomeApi from "./pages/HomeApi.jsx";
import Layout from "./pages/Layout.jsx";
import SearchPage from "./pages/SearchPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <StartPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/products",
        element: <HomeApi />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/start",
        element: <ProjectStart />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
