import { TypedEventEmitter } from '@libp2p/interface/events'
import { logger } from '@libp2p/logger'
import { peerIdFromString } from '@libp2p/peer-id'
import { multiaddr } from '@multiformats/multiaddr'
import type { PeerDiscovery, PeerDiscoveryEvents } from '@libp2p/interface/peer-discovery'
import type { PeerInfo } from '@libp2p/interface/peer-info'
import type { PeerStore } from '@libp2p/interface/peer-store'
import type { Startable } from '@libp2p/interface/startable'
import {DNSADDR, P2P} from "@multiformats/mafmt";
import {dnsaddrResolver} from "@multiformats/multiaddr/resolvers";

const log = logger('libmemo:dnsaddr-bootstrap')

const DEFAULT_BOOTSTRAP_TAG_NAME = 'bootstrap'
const DEFAULT_BOOTSTRAP_TAG_VALUE = 50
const DEFAULT_BOOTSTRAP_TAG_TTL = 120000
const DEFAULT_BOOTSTRAP_DISCOVERY_TIMEOUT = 1000

export interface BootstrapInit {
  /**
   * The list of peer addresses in multi-address format
   */
  list: string[]

  /**
   * How long to wait before discovering bootstrap nodes
   */
  timeout?: number

  /**
   * Tag a bootstrap peer with this name before "discovering" it (default: 'bootstrap')
   */
  tagName?: string

  /**
   * The bootstrap peer tag will have this value (default: 50)
   */
  tagValue?: number

  /**
   * Cause the bootstrap peer tag to be removed after this number of ms (default: 2 minutes)
   */
  tagTTL?: number
}

export interface BootstrapComponents {
  peerStore: PeerStore
}

/**
 * Emits 'peer' events on a regular interval for each peer in the provided list.
 */
class DnsaddrBootstrap extends TypedEventEmitter<PeerDiscoveryEvents> implements PeerDiscovery, Startable {
  static tag = 'bootstrap'

  private timer?: ReturnType<typeof setTimeout>
  private readonly dnsaddrList: string[]
  private readonly timeout: number
  private readonly components: BootstrapComponents
  private readonly _init: BootstrapInit
  private readonly p2pList: string[] = []
  // readonly [peerDiscovery] = this
  // readonly [Symbol.toStringTag] = '@libmemo/dnsaddr-bootstrap'

  constructor (components: BootstrapComponents, options: BootstrapInit = { list: [] }) {
    if (options.list == null || options.list.length === 0) {
      throw new Error('Bootstrap requires a list of peer addresses')
    }
    super()

    this.components = components
    this.timeout = options.timeout ?? DEFAULT_BOOTSTRAP_DISCOVERY_TIMEOUT
    this.dnsaddrList = []

    for (const candidate of options.list) {
      if (P2P.matches(candidate)) {
        this.p2pList.push(candidate)
      } else if (DNSADDR.matches(candidate)) {
        this.dnsaddrList.push(candidate)
      } else {
        log.error('Invalid multiaddr', candidate)
      }
    }

    this._init = options
  }

  isStarted (): boolean {
    return Boolean(this.timer)
  }


  async resolveDnsaddr (addr: string): Promise<string[]> {
    const ma = multiaddr(addr)
    try {
      return await dnsaddrResolver(ma)
    } catch (e) {
      return []
    }
  }

  /**
   * Start emitting events
   */
  start (): void {
    if (this.isStarted()) {
      return
    }

    this.timer = setTimeout(() => {
      for (const candidate of this.dnsaddrList) {
        this.resolveDnsaddr(candidate).then((result) => {
          this.discoverByPeers(result)
        })
      }
      this.discoverByPeers(this.p2pList)
    }, this.timeout)
  }

  discoverByPeers(peerIds: string[]): void {
    const list: PeerInfo[] = []

    for (const addr of peerIds) {
      const ma = multiaddr(addr)
      const peerIdStr = ma.getPeerId()
      if (peerIdStr == null) {
        log.error('Invalid bootstrap multiaddr without peer id')
        continue
      }

      const peerData: PeerInfo = {
        id: peerIdFromString(peerIdStr),
        multiaddrs: [ma],
        protocols: []
      }
      list.push(peerData)
    }

    if (list.length) {
      log('Starting bootstrap node discovery, discovering peers after %s ms', this.timeout)
      this._discoverBootstrapPeers(list)
        .catch(err => {
          log.error(err)
        })
    }
  }

  /**
   * Emit each address in the list as a PeerInfo
   */
  async _discoverBootstrapPeers (list: PeerInfo[]): Promise<void> {
    if (this.timer == null) {
      return
    }

    for (const peerData of list) {
      await this.components.peerStore.merge(peerData.id, {
        tags: {
          [this._init.tagName ?? DEFAULT_BOOTSTRAP_TAG_NAME]: {
            value: this._init.tagValue ?? DEFAULT_BOOTSTRAP_TAG_VALUE,
            ttl: this._init.tagTTL ?? DEFAULT_BOOTSTRAP_TAG_TTL
          }
        }
      })

      // check we are still running
      if (this.timer == null) {
        return
      }

      this.safeDispatchEvent('peer', { detail: peerData })
    }
  }

  /**
   * Stop emitting events
   */
  stop (): void {
    if (this.timer != null) {
      clearTimeout(this.timer)
    }

    this.timer = undefined
  }
}

export function dnsaddrBootstrap (init: BootstrapInit): (components: BootstrapComponents) => PeerDiscovery {
  return (components: BootstrapComponents) => new DnsaddrBootstrap(components, init)
}
