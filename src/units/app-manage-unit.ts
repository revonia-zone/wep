import {injectable, singleton} from "tsyringe";
import {LucideIcon} from "lucide-react";
import {ComponentType} from "react";
import {EventUnit} from "@/units/event-unit";
import {RouteObject} from "react-router-dom";

export interface ViewSidebarItem {
  icon: LucideIcon
  label: string
  command: string | (() => void)
}

export interface AppProvides {
  name: string
  routes?: RouteObject[]
  view?: {
    sidebar?: ViewSidebarItem[]
    rootComponents?: Array<ComponentType<void>>
  },
}

export interface AppInstance {
  appId: string
  activate: () => Promise<void>
  deactivate: () => Promise<void>
  provides: AppProvides
}

@injectable()
@singleton()
export class AppManageUnit {
  activatedApps = new Map<string, AppInstance>

  constructor(
    private eventUnit: EventUnit,
  ) {
  }

  async activateApp(instance: AppInstance) {
    if (this.activatedApps.has(instance.appId)) {
      return
    }
    try {
      await instance.activate()
      this.activatedApps.set(instance.appId, instance)
      this.eventUnit.safeDispatchEvent('libmemo:app-manage:activate', {
        detail: instance
      })
    } catch (e) {
      console.error('app activate error', e)
    }
  }


  async deactivateApp(appId: string) {
    const instance = this.activatedApps.get(appId)
    if (!instance) {
      return
    }
    this.eventUnit.safeDispatchEvent('libmemo:app-manage:deactivate', {
      detail: instance
    })
    try {
      await instance.deactivate()
    } catch (e) {
      console.error('app deactivate error', e)
    }
  }
}
