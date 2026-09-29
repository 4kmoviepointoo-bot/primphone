import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cartStore'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthStore {
  user: User | null
  isAuthModalOpen: boolean
  authMode: 'login' | 'register'
  setAuth: (user: User) => void
  logout: () => void
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  setAuthMode: (mode: 'login' | 'register') => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthModalOpen: false,
      authMode: 'login',

      setAuth: (user) => set({ user }),
      logout: () => {
        useCartStore.getState().clearCart()
        set({ user: null })
      },
      openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      setAuthMode: (mode) => set({ authMode: mode }),
    }),
    {
      name: 'primphone-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
