import { create, createStore, useStore } from 'zustand'

interface ViewState {
  titleEl: HTMLElement | null
  titleText: string
  setTitleText: (titleText: string) => void
  setTitleEl: (titleEl: HTMLElement | null) => void
}

export const useViewStore = create<ViewState>((set) => ({
  titleEl: null,
  titleText: '',
  setTitleText: (titleText) => set((state) => ({ ...state, titleText })),
  setTitleEl: (titleEl) => set((state) => ({ ...state, titleEl })),
}))

