const TOKEN_KEY = 'renisa_auth_token'
const MEMBER_KEY = 'renisa_member'
const ADMIN_KEY = 'renisa_admin_user'
const PORTAL_KEY = 'renisa_portal'

export const setToken = (token: string): void => {

  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export const setUser = (user: object, type: 'member' | 'admin'): void => {
  if (typeof window === 'undefined') return
  const key = type === 'member' ? MEMBER_KEY : ADMIN_KEY
  localStorage.setItem(key, JSON.stringify(user))
  localStorage.setItem(PORTAL_KEY, type)
}

export const getUser = (type: 'member' | 'admin'): object | null => {
  if (typeof window === 'undefined') return null
  const key = type === 'member' ? MEMBER_KEY : ADMIN_KEY
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const getPortal = (): 'member' | 'admin' | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(PORTAL_KEY) as 'member' | 'admin' | null
}

export const clearAll = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(MEMBER_KEY)
  localStorage.removeItem(ADMIN_KEY)
  localStorage.removeItem(PORTAL_KEY)
}
