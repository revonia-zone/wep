import {Search} from "lucide-react";
import {useEverythingStore} from "./store";
import EverythingRoot from "./everything-root";
import {AppInstance} from "@/units/app-manage-unit";
import EverythingResultPage from "@/apps/everything/result-page";


export default class EverythingApp implements AppInstance {
  appId = 'libmemo.builtin.everything'
  provides = {
    name: 'Everything',
    routes: [
      {
        path: 'everything/result',
        Component: EverythingResultPage
      }
    ],
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

  async activate() {

  }

  async deactivate() {
    useEverythingStore.getState().reset()
  }
}
