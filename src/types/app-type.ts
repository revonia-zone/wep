import {LucideIcon} from "lucide-react";
import { ComponentType } from "react";

export interface AppDefine {
  activate: () => Promise<void>
  deactivate: () => Promise<void>
  provide: () => AppProvide
}

export interface ViewSidebarItem {
  icon: LucideIcon
  label: string
  command: string | (() => void)
}

export interface AppProvide {
  name: string
  view?: {
    sidebar?: ViewSidebarItem[]
    rootComponents?: Array<ComponentType<any>>
  },
}
