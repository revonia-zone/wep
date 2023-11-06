import UserCard from "./user-card";
import PageTreeViewer from "./page-tree-viewer";
import NetworkCard from "./network-card";
import {Button} from "@/components/ui/button";
import {Blocks, Search, Settings} from "lucide-react";
import {useAppStore} from "@/stores/app-store";

export default function Sidebar() {
  const sidebarItems = useAppStore((state) => state.view.sidebar)


  return (
    <div className="w-64 border-r border-r-gray-100 flex flex-col px-2">
      <UserCard/>
      <div className="my-2">
        {sidebarItems.map((item, index) => (
          <Button
            variant="ghost"
            size="sm"
            className="w-full py-1 justify-start px-4 font-normal"
            key={index}
            onClick={() => typeof item.command === 'function' ? item.command() : console.log(item.command)}
          >
            <item.icon className="inline-block mr-2" size={16} strokeWidth={1.5} />
            <span>{item.label}</span>
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="w-full py-1 justify-start px-4 font-normal"
        >
          <Blocks className="inline-block mr-2" size={16} strokeWidth={1.5}/>
          Apps
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full py-1 justify-start px-4 font-normal"
        >
          <Settings className="inline-block mr-2" size={16} strokeWidth={1.5}/>
          Settings
        </Button>
      </div>
      <PageTreeViewer/>
      <NetworkCard/>
    </div>
  )
}
