import {Search, Share2} from "lucide-react";
import {AppInstance} from "@/units/app-manage-unit";
import ShareMemoPage from "@/apps/share/share-memo-page";


export default class ShareApp implements AppInstance {
  appId = 'libmemo.builtin.share'
  provides = {
    name: 'Share',
    routes: [
      {
        path: 'discover/share/:userId/memo/:memoId',
        Component: ShareMemoPage
      }
    ],
    view: {
      sidebar: [
        {
          icon: Share2,
          label: 'Share',
          command: () => {},
          group: 'discover'
        }
      ],
      rootComponents: [
      ]
    }
  }

  async activate() {

  }

  async deactivate() {
  }
}
