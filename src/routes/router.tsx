import {createBrowserRouter, RouteObject} from "react-router-dom";
import Root from "../pages/root";
import HomePage from "../pages/home";
import React from "react";
import ErrorPage from "../pages/error";
import MemoPage from "@/pages/memo";
import NetworkPage from "@/pages/network";
import UserPage from "@/pages/user";
import AppsPage from "@/pages/apps";
import SettingsPage from "@/pages/settings";
import MemoEditPage from "@/pages/memo/edit";

export function createRouter(routes: RouteObject[]) {
  return createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "user",
          element: <UserPage />,
        },
        {
          path: "memo/:memoId",
          element: <MemoPage />,
        },
        {
          path: "memo/:memoId/edit",
          element: <MemoEditPage />,
        },
        {
          path: 'network',
          element: <NetworkPage />
        },
        {
          path: "apps",
          element: <AppsPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "/",
          element: <HomePage />,
        },
        ...routes,
      ]
    },
  ]);
}
