import { create, createStore, useStore } from 'zustand'
import {} from "@/units/p2p-unit";
import {PeerId} from "@libp2p/interface/peer-id";
import {Multiaddr} from "@multiformats/multiaddr";

export enum NetworkStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

interface PeerData {
  id: PeerId
  protocols: string[]
  multiaddrs: Multiaddr[]
  tags: Record<string, number>
}

interface NetworkStoreData {
  status: NetworkStatus
  peerMap: Record<string, PeerData>
  multiaddrs: Multiaddr[]
}

interface NetworkStore extends NetworkStoreData {
  updateMultiaddrs: (multiaddrs: Multiaddr[]) => void
  setStatus: (status: NetworkStatus) => void
  updatePeer: (peerData: Partial<PeerData> & { id: PeerId }) => void
  deletePeer: (peerIdStr: string) => void
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  status: NetworkStatus.DISCONNECTED,
  peerMap: {},
  multiaddrs: [],
  setStatus: (status) => set((state) => ({ status })),
  updateMultiaddrs: (multiaddrs) => set((state) => ({ multiaddrs })),
  updatePeer: (peerData) => set((state) => {
    const peerMap = { ...state.peerMap }
    const prev = peerMap[peerData.id.toString()] || {}
    peerMap[peerData.id.toString()] = {...prev, ...peerData}
    return { peerMap }
  }),
  deletePeer: (peerIdStr) => set((state) => {
    if (state.peerMap[peerIdStr]) {
      const peerMap = {...state.peerMap}
      delete peerMap[peerIdStr]
      return { peerMap }
    }
    return state
  })
}))

