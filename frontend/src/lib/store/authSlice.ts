import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Member, AdminUser } from '@/types'
import { getToken, getUser, getPortal, setToken, setUser, clearAll } from '@/lib/storage'

interface AuthState {
  member: Member | null
  adminUser: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  portal: 'member' | 'admin' | null
}

const initialState: AuthState = {
  member: null,
  adminUser: null,
  token: null,
  isAuthenticated: false,
  portal: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string
        member?: Member
        adminUser?: AdminUser
        portal: 'member' | 'admin'
      }>
    ) => {
      const { token, member, adminUser, portal } = action.payload
      state.token = token
      state.isAuthenticated = true
      state.portal = portal
      if (portal === 'member' && member) {
        state.member = member
        setToken(token)
        setUser(member, 'member')
      } else if (portal === 'admin' && adminUser) {
        state.adminUser = adminUser
        setToken(token)
        setUser(adminUser, 'admin')
      }
    },
    logout: (state) => {
      state.member = null
      state.adminUser = null
      state.token = null
      state.isAuthenticated = false
      state.portal = null
      clearAll()
    },
    initAuth: (state) => {
      if (typeof window === 'undefined') return
      const token = getToken()
      const portal = getPortal()
      if (token && portal) {
        state.token = token
        state.isAuthenticated = true
        state.portal = portal
        if (portal === 'member') {
          const member = getUser('member') as Member | null
          state.member = member
        } else if (portal === 'admin') {
          const adminUser = getUser('admin') as AdminUser | null
          state.adminUser = adminUser
        }
      }
    },
    updateMemberProfile: (state, action: PayloadAction<Partial<Member>>) => {
      if (state.member) {
        state.member = { ...state.member, ...action.payload }
        setUser(state.member, 'member')
      }
    },
  },
})

export const { setCredentials, logout, initAuth, updateMemberProfile } = authSlice.actions
export default authSlice.reducer
