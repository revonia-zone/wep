import {Outlet} from "react-router-dom";
import Layout from "@/components/base/layout";
import {useAppStore} from "@/stores/app-store";
import {ComponentType} from "react";

export default function Root() {
  const components = useAppStore((state) => state.view.rootComponents)
  return (
    <Layout>
      <Outlet />
      {components.map((Component: ComponentType, index: number) => <Component key={index} />)}
    </Layout>
  );
}
