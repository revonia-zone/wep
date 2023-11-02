import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import {bootstrap} from "@libp2p/bootstrap";
import { pingService } from 'libp2p/ping'

const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]

async function createNode() {
  const node = await createLibp2p({
    // libp2p nodes are started by default, pass false to override this
    start: false,
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/8000/ws']
    },
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
      bootstrap({
        list: bootstrapMultiaddrs, // provide array of multiaddrs
      })
    ],
    services: {
      ping: pingService({
        protocolPrefix: 'ipfs', // default
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

  console.log('libp2p id is', node.peerId.toString())

  console.log('libp2p is listening on the following addresses: ')
  listenAddrs.forEach((addr) => {
    console.log(addr.toString())
  })

  node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
  })

  node.addEventListener('peer:connect', (evt) => {
    console.log('Connected to %s', evt.detail.toString()) // Log connected peer
  })
}

run()

export {}
