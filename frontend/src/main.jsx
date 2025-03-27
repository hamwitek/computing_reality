import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./pages/Layout.jsx";
import StartPage from "./pages/StartPage.jsx";
import ProjectStart from "./pages/ProjectStart.jsx";
import Projects from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/About.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/projectstart",
        element: <ProjectStart />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/",
        element: <StartPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
