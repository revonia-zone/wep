import { create, createStore, useStore } from 'zustand'
import {UserInfo} from "@/units/auth-unit";

interface UserState {
  users: UserInfo[]
  currentUserIndex: number
  login: (user: UserInfo) => void
  logout: () => void
  changeUser: (index: number) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUserIndex: 0,
  login: (user: UserInfo) => set((state) => ({
    users: [...state.users, user],
    currentUserIndex: state.users.length
  })),
  logout: () => set((state) => ({
    users: state.users.filter((_, index) => index !== state.currentUserIndex),
    currentUserIndex: state.users.length - 1
  })),
  changeUser: (index: number) => set((state) => ({ currentUserIndex: index }))
}))

