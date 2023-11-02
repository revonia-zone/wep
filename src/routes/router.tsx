import {createBrowserRouter} from "react-router-dom";
import Root from "./root";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import React from "react";
import ErrorPage from "../pages/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;
