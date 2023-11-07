import { create } from 'zustand'
import {ComponentType} from "react";
import {produce, enableMapSet} from "immer";
import {AppInstance, ViewSidebarItem} from "@/units/app-manage-unit";
import {RouteObject} from "react-router-dom";

interface AppState {
  apps: Set<AppInstance>
  appRoutes: RouteObject[]
  addApp: (instance: AppInstance) => void
  removeApp: (instance: AppInstance) => void
  view: {
    sidebar: ViewSidebarItem[]
    rootComponents: Array<ComponentType<any>>
  }
  showRequireRefreshDialog: boolean
  bootstrapped: boolean
  setBootstrapped: () => void
}

export const useAppStore = create<AppState>((set) => ({
  apps: new Set,
  appRoutes: [],
  showRequireRefreshDialog: false,
  bootstrapped: false,
  setBootstrapped: () => set(() => ({ bootstrapped: true })),
  view: {
    sidebar: [],
    rootComponents: [],
  },
  addApp: (instance) => {
    set((state) => produce(state, (draft) => {
      if (draft.apps.has(instance)) {
        return
      }
      draft.apps.add(instance)
      if (instance.provides.view?.sidebar?.length) {
        draft.view.sidebar.push(...instance.provides.view.sidebar)
      }

      if (instance.provides.view?.rootComponents?.length) {
        draft.view.rootComponents.push(...instance.provides.view.rootComponents)
      }

      if (instance.provides.routes?.length) {
        draft.appRoutes.push(...instance.provides.routes)
        if (state.bootstrapped) {
          draft.showRequireRefreshDialog = true
        }
      }
    }))
  },
  removeApp: (instance) => {
    set((state) => produce(state, (draft) => {
      if (!draft.apps.has(instance)) {
        return
      }

      draft.apps.delete(instance)
      if (instance.provides.view?.sidebar) {
        instance.provides.view.sidebar.forEach((item) => {
          const idx = draft.view.sidebar.findIndex((i) => i.command === item.command)
          if (idx !== -1) {
            draft.view.sidebar.splice(idx, 1)
          }
        })
      }
      if (instance.provides.view?.rootComponents) {
        instance.provides.view.rootComponents.forEach((item) => {
          const idx = draft.view.rootComponents.findIndex((i) => i === item)
          if (idx !== -1) {
            draft.view.rootComponents.splice(idx, 1)
          }
        })
      }

      if (instance.provides.routes?.length) {
        draft.showRequireRefreshDialog = true
      }
    }))
  },
}))
