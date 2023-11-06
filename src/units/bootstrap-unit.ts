import { injectable, singleton} from "tsyringe";
import {EventUnit} from "./event-unit";
import {AuthUnit} from "@/units/auth-unit";
import {P2pUnit} from "@/units/p2p-unit";
import {AppInstance, AppManageUnit} from "@/units/app-manage-unit";
import {useUserStore} from "@/stores/user-store";
import {NetworkStatus, useNetworkStore} from "@/stores/network-store";
import {useAppStore} from "@/stores/app-store";
import EverythingApp from "@/apps/everything";

@injectable()
@singleton()
export class BootstrapUnit {
  private _started = false

  get started() {
    return this._started
  }

  constructor(
    private eventUnit: EventUnit,
    private authUnit: AuthUnit,
    private appManageUnit: AppManageUnit,
    private p2pUnit: P2pUnit,
  ) {
  }

  async start() {
    if (this._started) {
      return
    }
    let user = await this.authUnit.getCurrentUser()
    if (!user) {
      user = await this.authUnit.createGuestUser()
      this.authUnit.setCurrentUser(user)
    }
    await this.p2pUnit.start()
    useUserStore.getState().login(user)

    const networkState = useNetworkStore.getState()

    networkState.update({ status: NetworkStatus.CONNECTED })

    this.p2pUnit.node.addEventListener('peer:connect', () => {
      networkState.update({ peers: this.p2pUnit.node.getPeers() })
    })

    this.p2pUnit.node.addEventListener('self:peer:update', () => {
      networkState.update({ multiaddrs: this.p2pUnit.node.getMultiaddrs() })
    })


    const appState = useAppStore.getState()
    this.eventUnit.addEventListener('libmemo:app-manage:activate', (evt) => {
      appState.addApp(evt.detail)
    })

    this.eventUnit.addEventListener('libmemo:app-manage:deactivate', (evt) => {
      appState.removeApp(evt.detail)
    })

    const apps: AppInstance[] = [
      new EverythingApp()
    ]

    for (const app of apps) {
      await this.appManageUnit.activateApp(app)
    }

    this._started = true
    appState.setBootstrapped()
  }
}
