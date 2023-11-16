import {createLibp2p} from "libp2p";
import {webSockets} from "@libp2p/websockets";
import {webRTCDirect} from "@libp2p/webrtc";
import {circuitRelayTransport} from "libp2p/circuit-relay";
import {noise} from "@chainsafe/libp2p-noise";
import {mplex} from "@libp2p/mplex";
import {yamux} from "@chainsafe/libp2p-yamux";
import {identifyService} from "libp2p/identify";
import {pingService} from "libp2p/ping";
import {kadDHT} from "@libp2p/kad-dht";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {AuthUnit} from "../auth-unit";
import {DataUnit} from "../data-unit";
import {injectable, singleton} from "tsyringe";
import {EventUnit} from "../event-unit";
import {PeerId} from "@libp2p/interface/peer-id";
import {dnsaddrBootstrap} from "@/units/p2p-unit/dnsaddr-bootstrap";
import {Multiaddr} from "@multiformats/multiaddr";
import {webRTC} from "@libp2p/webrtc";

type P2pNodeWithService = Awaited<ReturnType<typeof createP2pNode>>

export async function createP2pNode(peerId: PeerId) {
  const node = await createLibp2p({
    peerId,
    start: false,
    addresses: {
      announceFilter: (addrs: Multiaddr[]) => {
        return addrs.filter((addr) => addr.protoNames().includes('webrtc'))
      },
      listen: [`/webrtc`]
    },
    transports: [
      webSockets(),
      webRTCDirect(),
      webRTC({
        rtcConfiguration: {
          iceServers: [
            { urls: "stun:stun.stunprotocol.org:3478" },
            { urls: "stun:freestun.net:3479" },
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            {
              urls: "turns:freestun.net:5350",
              username: "free",
              credential: "free"
            }
          ]
        }
      }),
      circuitRelayTransport({
        discoverRelays: 10
      })
    ],
    connectionGater: {
    },
    connectionEncryption: [noise()],
    streamMuxers: [mplex(), yamux()],
    peerDiscovery: [
      dnsaddrBootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io',
          // '/dnsaddr/bootstrap.libmemo.app',
          // '/dns4/local.wep-server.dev/tcp/443/wss/p2p/12D3KooWEEkMYYgRta9NGqvUS6xd94ufwqzmJLp8LhmThQq6m86C'
        ]
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

    const node = await createP2pNode(user.peerId)
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
