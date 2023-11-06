import {Search} from "lucide-react";
import {useEverythingStore} from "./store";
import EverythingRoot from "./everything-root";
import {AppProvide} from "@/types/app-type";

export async function activate() {

}

export async function deactivate() {
  useEverythingStore.getState().reset()
}

export function provide(): AppProvide {
  return {
    name: 'Everything',
    view: {
      sidebar: [
        {
          icon: Search,
          label: 'Everything',
          command: () => useEverythingStore.getState().summon()
        }
      ],
      rootComponents: [
        EverythingRoot,
      ]
    }
  }
}
