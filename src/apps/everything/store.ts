import { create, createStore, useStore } from 'zustand'

export enum SearchType {
  ALL = 'all',
  BLOCK = 'block',
  PAGE = 'page',
  ACTION = 'action',
  AUTHOR = 'author',
  TAG = 'tag',
}

interface ResultItem {
  title: string
  type: SearchType
  summary: string
  url: string
}

interface EverythingStoreData {
  showModal: boolean
  keyword: string
  type: SearchType
  recentSearches: ResultItem[]
  results: ResultItem[]
}

interface EverythingStore extends EverythingStoreData {
  summon: (input?: {keyword?: string, type?: SearchType}) => void
  reset: () => void
  execute: () => void
  setShowModal: (show: boolean) => void
  setInput: (input: {keyword?: string, type?: SearchType}) => void
}

export const useEverythingStore = create<EverythingStore>((set) => ({
  showModal: false,
  keyword: '',
  type: SearchType.ALL,
  recentSearches: [],
  results: [],
  setShowModal: (showModal) => set((state) => ({ ...state, showModal })),
  setInput: (input) => {
    set((state) => ({ ...state, ...input }))
    useEverythingStore.getState().execute()
  },
  execute: () => {

  },
  summon: (input) => {
    if (input) {
      set((state) => ({ ...state, ...input, showModal: true }))
      useEverythingStore.getState().execute()
    } else {
      set((state) => ({ ...state, showModal: true }))
    }
  },
  reset: () => set(() => ({
    active: false,
    keyword: '',
    type: SearchType.ALL,
    recentSearches: [],
    results: [],
  })),
}))

