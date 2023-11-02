import {createLibp2p} from 'libp2p'
import {webSockets} from '@libp2p/websockets'
import {noise} from '@chainsafe/libp2p-noise'
import {mplex} from '@libp2p/mplex'
import {bootstrap} from '@libp2p/bootstrap'
import {pingService} from 'libp2p/ping'
import {kadDHT} from '@libp2p/kad-dht'
import {webRTC} from '@libp2p/webrtc'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { yamux } from '@chainsafe/libp2p-yamux'
import * as filters from '@libp2p/websockets/filters'
import { identifyService } from 'libp2p/identify'

// Known peers addresses
const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
]
