import {createLibp2p, Libp2p} from "libp2p";
import {webSockets} from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import {webRTC} from "@libp2p/webrtc";
import {circuitRelayTransport} from "libp2p/circuit-relay";
import {noise} from "@chainsafe/libp2p-noise";
import {mplex} from "@libp2p/mplex";
import {yamux} from "@chainsafe/libp2p-yamux";
import {bootstrap} from "@libp2p/bootstrap";
import {identifyService} from "libp2p/identify";
import {pingService} from "libp2p/ping";
import {kadDHT} from "@libp2p/kad-dht";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {AuthUnit} from "./auth-unit";
import {DataUnit} from "./data-unit";
import {injectable, singleton} from "tsyringe";
import {EventUnit} from "./event-unit";
import {PeerId} from "@libp2p/interface/peer-id";


type P2pNodeWithService = Awaited<ReturnType<typeof createP2pNode>>

export async function createP2pNode(peerId: PeerId, bootstrapMultiaddrs: string[]) {
  const node = await createLibp2p({
    peerId,
    start: false,
    addresses: {
      listen: [
        // create listeners for incoming WebRTC connection attempts on on all
        // available Circuit Relay connections
        '/webrtc'
      ]
    },
    transports: [
      webSockets({
        // filter: filters.all
      }),
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 0
      })
    ],
    connectionGater: {
      // denyDialMultiaddr: () => false,
    },
    connectionEncryption: [noise()],
    streamMuxers: [mplex(), yamux()],
    peerDiscovery: [
      bootstrap({
        list: bootstrapMultiaddrs, // provide array of multiaddrs
      })
    ],
    services: {
      identify: identifyService(),
      ping: pingService(),
      dht: kadDHT(),
      pubsub: gossipsub({})
    },
  })

  return node
}

@injectable()
@singleton()
export class P2pUnit {

  bootstrapMultiaddrs = [
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
  ]

  private _node: P2pNodeWithService | null = null

  get node() {
    if (!this._node) {
      throw new Error('p2p node not started')
    }
    return this._node
  }

  constructor(
    private eventUnit: EventUnit,
    private authUnit: AuthUnit,
    private dataUnit: DataUnit
  ) {

  }

  async start() {
    const user = await this.authUnit.getCurrentUser()

    if (user === null) {
      return
    }

    const node = await createP2pNode(user.peerId, this.bootstrapMultiaddrs)
    this._node = node

    // node.addEventListener('peer:discovery', (evt) => {
    //   console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
    // })
    //
    // node.addEventListener('peer:connect', (evt) => {
    //   console.log('Connected to %s', evt.detail.toString()) // Log connected peer
    // })
    //
    // node.services.pubsub.addEventListener('message', (message) => {
    //   console.log(`${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
    // })
    //
    // node.addEventListener('self:peer:update', (evt) => {
    //   const addrs = node.getMultiaddrs()
    //
    //   for (const addr of addrs) {
    //     console.log(`Advertising with a relay address of ${addr.toString()}`)
    //   }
    // })
    // node.services.pubsub.subscribe('fruit')
    //
    // node.services.pubsub.publish('fruit', new TextEncoder().encode('banana'))

    await node.start()
    return node
  }
}
