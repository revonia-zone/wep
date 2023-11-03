import {createBrowserRouter} from "react-router-dom";
import Root, {rootLoader} from "./root";
import HomePage from "../pages/home";
import React from "react";
import ErrorPage from "../pages/error";
import PPage from "@/pages/p";
import NetworkPage from "@/pages/network";
import UserPage from "@/pages/user";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [

      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "p/:pageId",
        element: <PPage />,
      },
      {
        path: 'network',
        element: <NetworkPage />
      },
      {
        path: "/",
        element: <HomePage />,
      },

    ]
  },

]);

export default router;
