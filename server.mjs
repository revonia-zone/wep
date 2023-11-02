import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import {bootstrap} from "@libp2p/bootstrap";
import { pingService } from 'libp2p/ping'
import {identifyService} from "libp2p/identify";
import {kadDHT} from "@libp2p/kad-dht";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {circuitRelayTransport} from "libp2p/circuit-relay";
import {generateKeyPair, importKey} from "@libp2p/crypto/keys";
import {createFromPrivKey} from "@libp2p/peer-id-factory";
process.env.DEBUG = 'libp2p:*';

const privateKey = 'mL/tjLmp2vjGOm8uQC+si4X+hRaZ0Qd4irOg2kBJCqCBGmeGj4dN0hSvJB3iLAZErvMK6/Eb7F+HJRBjc/gt+f88XxGl6DPziECbkhOIutaWLhvG3i5eNdPCRaOjA3Uwsts9sdYSuqwe/eaSISe2zLQ'
const password = 'guest'

const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]

async function createNode() {
  const key = await importKey(privateKey, password)
  const peerId = await createFromPrivKey(key)

  const node = await createLibp2p({
    peerId,
    // libp2p nodes are started by default, pass false to override this
    start: false,
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/8000/ws',
        '/dns4/local.wep-server.dev/tcp/443/ws',
      ]
    },
    transports: [
      webSockets(),
      circuitRelayTransport({
        discoverRelays: 10,
      })
    ],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
      // bootstrap({
      //   list: bootstrapMultiaddrs, // provide array of multiaddrs
      // })
    ],
    services: {
      identify: identifyService(),
      ping: pingService(),
      dht: kadDHT({
        clientMode: false,
      }),
    },
  })
  return node
}

async function run() {
  const node = await createNode()
  await node.start()
  console.log('libp2p has started')

  const listenAddrs = node.getMultiaddrs()

  // console.log('libp2p id is', node.peerId.toString())
  //
  // console.log('libp2p is listening on the following addresses: ')
  // listenAddrs.forEach((addr) => {
  //   console.log(addr.toString())
  // })
  //
  // node.addEventListener('peer:discovery', (evt) => {
  //   console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
  // })
  //
  // node.addEventListener('peer:connect', (evt) => {
  //   console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  // })
  //
  // node.addEventListener('connection:open', (evt) => {
  //   console.log('Connection opened to %s', evt.detail.remoteAddr.toString()) // Log connected peer
  // })
  global.myNode = node
}

run()
