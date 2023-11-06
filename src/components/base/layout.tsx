import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import Sidebar from "./sidebar";
import Header from "./header/header";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl py-12">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  )
}
