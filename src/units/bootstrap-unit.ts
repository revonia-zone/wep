import { injectable, singleton} from "tsyringe";
import {EventUnit} from "./event-unit";
import {AuthUnit} from "@/units/auth-unit";
import {P2pUnit} from "@/units/p2p-unit";
import {AppInstance, AppManageUnit} from "@/units/app-manage-unit";
import {useUserStore} from "@/stores/user-store";
import {NetworkStatus, useNetworkStore} from "@/stores/network-store";
import {useAppStore} from "@/stores/app-store";
import EverythingApp from "@/apps/everything";
import ShareApp from "@/apps/share";

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

    networkState.setStatus(NetworkStatus.CONNECTED)

    this.p2pUnit.node.addEventListener('peer:connect', (evt) => {
      networkState.updatePeer({
        id: evt.detail,
        protocols: [],
        multiaddrs: [],
        tags: {},
      })
    })

    this.p2pUnit.node.addEventListener('peer:disconnect', (evt) => {
      networkState.deletePeer(evt.detail.toString())
    })


    this.p2pUnit.node.addEventListener('peer:update', (evt) => {
      const peer = evt.detail.peer

      if (networkState.peerMap[peer.id.toString()]) {
        const tags: Record<string, number> = {}

        for (const [key, tag] of peer.tags.entries()) {
          tags[key] = tag.value
        }

        networkState.updatePeer({
          id: peer.id,
          protocols: peer.protocols,
          multiaddrs: peer.addresses.map(a => a.multiaddr),
          tags,
        })
      }
    })

    this.p2pUnit.node.addEventListener('peer:identify', (evt) => {
      if (networkState.peerMap[evt.detail.peerId.toString()]) {
        debugger
        networkState.updatePeer({
          id: evt.detail.peerId,
          protocols: evt.detail.protocols,
          multiaddrs: evt.detail.listenAddrs,
          tags: {},
        })
      }
    })

    this.p2pUnit.node.addEventListener('self:peer:update', () => {
      networkState.updateMultiaddrs(this.p2pUnit.node.getMultiaddrs())
    })


    const appState = useAppStore.getState()
    this.eventUnit.addEventListener('libmemo:app-manage:activate', (evt) => {
      appState.addApp(evt.detail)
    });

    this.eventUnit.addEventListener('libmemo:app-manage:deactivate', (evt) => {
      appState.removeApp(evt.detail)
    })

    const apps: AppInstance[] = [
      new EverythingApp(),
      new ShareApp(),
    ]

    for (const app of apps) {
      await this.appManageUnit.activateApp(app)
    }

    this._started = true
    appState.setBootstrapped()
  }
}
