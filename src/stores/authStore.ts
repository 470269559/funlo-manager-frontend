import { create } from 'zustand'
import { TOKEN_KEY } from '../constants/auth'
import { getAuthMenus, getCurrentUser } from '../services/authService'
import type { MenuItem, Session, User } from '../types/system'

type AuthState = {
  booting: boolean
  menus: MenuItem[]
  session: Session | null
  bootstrap: () => Promise<void>
  logout: () => void
  setSession: (session: Session) => Promise<MenuItem[]>
}

export const useAuthStore = create<AuthState>((set) => ({
  booting: true,
  menus: [],
  session: null,
  async bootstrap() {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      set({ booting: false, menus: [], session: null })
      return
    }

    try {
      const [user, menus] = await Promise.all([
        getCurrentUser(),
        getAuthMenus(),
      ])
      set({ booting: false, menus, session: { accessToken: token, user } })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      set({ booting: false, menus: [], session: null })
    }
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY)
    set({ menus: [], session: null })
  },
  async setSession(session) {
    localStorage.setItem(TOKEN_KEY, session.accessToken)
    set({ session })
    const menus = await getAuthMenus()
    set({ menus })
    return menus
  },
}))

export function getDisplayName(user: User) {
  return user.nickname || user.username
}
