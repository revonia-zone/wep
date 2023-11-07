import UserCard from "./user-card";
import PageTreeViewer from "./page-tree-viewer";
import NetworkCard from "./network-card";
import {Button} from "@/components/ui/button";
import {Blocks, Settings} from "lucide-react";
import {useAppStore} from "@/stores/app-store";
import {Link} from "react-router-dom";
import {groupBy} from "lodash";
import {useMemo} from "react";

export default function Sidebar() {
  const sidebarItems = useAppStore((state) => state.view.sidebar)
  const grouped = useMemo(() => {
    return groupBy(sidebarItems, 'group')
  }, [sidebarItems]);

  const { main, apps, ...rest } = grouped;

  const restGroups = useMemo(() => {
    const keys = Object.keys(rest)
    const groups: Array<{ label: string, key: string }> = []
    for (const key of keys) {
      let label = rest[key][0].groupLabel
      if (!label) {
        label = key.toUpperCase()
      }
      groups.push({ label, key })
    }
    groups.sort((a, b) => a.label.localeCompare(b.label))
    return groups
  }, [rest])

  return (
    <div className="w-64 border-r border-r-gray-100 flex flex-col">
      <UserCard/>
      <div className="flex-1 flex-col flex gap-2 my-2 overflow-y-auto px-2">
        <div>
          {main?.map((item, index) => (
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

          <Link to="/apps">
            <Button
              variant="ghost"
              size="sm"
              className="w-full py-1 justify-start px-4 font-normal"
            >
              <Blocks className="inline-block mr-2" size={16} strokeWidth={1.5}/>
              Apps
            </Button>
          </Link>


          <Link to="/settings">
            <Button
              variant="ghost"
              size="sm"
              className="w-full py-1 justify-start px-4 font-normal"
            >
              <Settings className="inline-block mr-2" size={16} strokeWidth={1.5}/>
              Settings
            </Button>
          </Link>
        </div>

        {restGroups.map(({ label, key }) => {
          return (
            <div key={key}>
              <label className="font-medium text-xs text-gray-500 px-2 mb-2">{label}</label>
              {rest[key].map(({ label, icon: Icon}, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full py-1 justify-start px-4 font-normal"
                >
                  <Icon className="inline-block mr-2" size={16} strokeWidth={1.5}/>
                  {label}
                </Button>
              ))}
            </div>
          )
        })}

        <label className="font-medium text-xs text-gray-500 px-2 mb-2">MEMOS</label>
        <PageTreeViewer/>
        {
          apps?.length && (
            <div>
              <label className="font-medium text-xs text-gray-500 px-2 mb-2">APPS</label>
              {apps.map((item, index) => (
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
            </div>
          )
        }
      </div>
      <NetworkCard/>
    </div>
  )
}
