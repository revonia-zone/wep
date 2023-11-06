import { create, createStore, useStore } from 'zustand'
import {} from "@/units/p2p-unit";
import {PeerId} from "@libp2p/interface/peer-id";
import {Multiaddr} from "@multiformats/multiaddr";

export enum NetworkStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

interface NetworkStoreData {
  status: NetworkStatus
  peers: PeerId[]
  multiaddrs: Multiaddr[]
}

interface NetworkStore extends NetworkStoreData {
  update: (data: Partial<NetworkStoreData>) => void
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  status: NetworkStatus.DISCONNECTED,
  peers: [],
  multiaddrs: [],
  update: (data: Partial<NetworkStoreData>) => set((state) => ({ ...state, ...data }))
}))

