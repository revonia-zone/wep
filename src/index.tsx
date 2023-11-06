import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import {createRouter} from "@/routes/router";
import {RouterProvider} from "react-router-dom";
import {container} from "tsyringe";
import {BootstrapUnit} from "@/units/bootstrap-unit";
import {useAppStore} from "@/stores/app-store";

const bootstrap = container.resolve(BootstrapUnit)

// localStorage.debug = 'libp2p:*'

bootstrap.start().then(() => {
  const router = createRouter(useAppStore.getState().appRoutes)
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
})

