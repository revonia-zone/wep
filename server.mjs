import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import {bootstrap} from "@libp2p/bootstrap";
import { pingService } from 'libp2p/ping'
import {circuitRelayServer} from "libp2p/circuit-relay";
import {generateKeyPair, importKey} from "@libp2p/crypto/keys";
import {createFromPrivKey} from "@libp2p/peer-id-factory";
import {identifyService} from "libp2p/identify";
import {kadDHT} from "@libp2p/kad-dht";

const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]

async function createNode(peerId) {
  const node = await createLibp2p({
    peerId,
    // libp2p nodes are started by default, pass false to override this
    start: false,
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/8000/ws',
      ],
      announce: [
        '/dns4/local.wep-server.dev/tcp/443/wss'
      ]
    },
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
      // bootstrap({
      //   list: bootstrapMultiaddrs, // provide array of multiaddrs
      // })
    ],
    services: {
      dht: kadDHT({
        clientMode: false,
      }),
      identify: identifyService(),
      circuitRelay: circuitRelayServer({
        advertise: true,
      }),
      ping: pingService({
        protocolPrefix: 'ipfs', // default
      }),
    },
  })
  return node
}

async function run() {
  const privateKey = 'mGXwLJm5fWSD8fG6u5Qz9S81q/u9ANriBC3DOlF6aDTX09v6ZUFyfbXcvGdIc5+qlQL4x+zb4qDEWpxsnP9TH+235+nuVR5xNPjjuQv70pGAXcCBPgtcy8KVD6vrvn0E9rQqXnMdIslFV7mu4FC5fYg'
  const key = await importKey(privateKey, 'guest')
  const peerId = await createFromPrivKey(key)

  const node = await createNode(peerId)
  await node.start()
  console.log('libp2p has started')

  const listenAddrs = node.getMultiaddrs()

  console.log('libp2p id is', node.peerId.toString())

  console.log('libp2p is listening on the following addresses: ')
  listenAddrs.forEach((addr) => {
    console.log(addr.toString())
  })

  // console.log(`/dns4/local.wep-server.dev/tcp/443/wss/p2p/${peerId.toString()}`)

  node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
  })

  node.addEventListener('peer:connect', (evt) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  })

  node.addEventListener('advert:success', (evt) => {
    console.log('advert success', evt.detail)
  })

  node.addEventListener('advert:error', (evt) => {
    console.log('advert error', evt.detail)
  })
}

run()

export {}
