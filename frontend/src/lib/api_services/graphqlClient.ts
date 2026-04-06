import axios from 'axios'
import { getToken, clearAll } from '@/lib/storage'

const GRAPHQL_URL = (process.env.NEXT_PUBLIC_API_URL) + '/graphql'

const graphqlClient = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

graphqlClient.interceptors.request.use((config) => {
  const token = getToken()
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Only auto-logout on token expiry (JWT expired), not on generic auth errors
// (e.g. "Authentication required" can fire on member routes when admin is logged in — handled by onError)
const TOKEN_EXPIRY_PATTERNS = ['jwt expired', 'token expired', 'token is not valid']

const handleAuthExpiry = () => {
  clearAll()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

graphqlClient.interceptors.response.use(
  (response) => {
    const errors = response.data?.errors
    if (errors?.length) {
      const msg = errors[0].message?.toLowerCase() || ''
      if (TOKEN_EXPIRY_PATTERNS.some((p) => msg.includes(p))) {
        handleAuthExpiry()
      }
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      handleAuthExpiry()
    }
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default graphqlClient
