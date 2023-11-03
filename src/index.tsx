import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import router from "@/routes/router";
import {RouterProvider} from "react-router-dom";

// localStorage.debug = 'libp2p:*'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
