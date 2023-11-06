import { create } from 'zustand'
import {AppDefine, ViewSidebarItem} from "@/types/app-type";
import {ComponentType} from "react";
import {produce} from "immer";

interface App extends AppDefine {
  umount: () => void
}

interface AppState {
  apps: App[]
  activateApp: (define: AppDefine) => void
  deactivateApp: (define: AppDefine) => void
  view: {
    sidebar: ViewSidebarItem[]
    rootComponents: Array<ComponentType<any>>
  }
}

export const useAppStore = create<AppState>((set) => ({
  apps: [],
  view: {
    sidebar: [],
    rootComponents: [],
  },
  activateApp: async (define) => {
    try {
      const provide = define.provide()
      await define.activate()

      set((state) => produce(state, (draft) => {
        if (provide.view?.sidebar?.length) {
          draft.view.sidebar.push(...provide.view.sidebar)
        }
        if (provide.view?.rootComponents?.length) {
          draft.view.rootComponents.push(...provide.view.rootComponents)
        }
      }))

      const umount = () => {
        set((state) => produce(state, (draft) => {
          if (provide.view?.sidebar?.length) {
            draft.view.sidebar = draft.view.sidebar.filter((item) => !provide.view?.sidebar?.includes(item))
          }
          if (provide.view?.rootComponents?.length) {
            draft.view.rootComponents = draft.view.rootComponents.filter((item) => !provide.view?.rootComponents?.includes(item))
          }
        }))
      }

      const app = {
        ...define,
        umount,
      }
      set((state) => ({ ...state, apps: [...state.apps, app] }))
    } catch (e) {
      console.error('app activate error', e)
    }

  },
  deactivateApp: async (define) => {
    const app = useAppStore.getState().apps.find((a) => a === define)
    if (app) {
      try {
        app.umount()
        await app.deactivate()
      } catch (e) {
        console.error('app deactivate error', e)
      }
    }
  },
}))
