import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import Sidebar from "./sidebar";
import Header from "./header";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {props.children}
        </main>
      </div>
    </div>
  )
}
