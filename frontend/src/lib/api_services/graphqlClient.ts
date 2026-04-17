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

    const graphqlMsg = error.response?.data?.errors?.[0]?.message
    const serverMsg = error.response?.data?.message
    const isNetworkError = !error.response

    let message: string
    if (graphqlMsg) {
      message = graphqlMsg
    } else if (serverMsg) {
      message = serverMsg
    } else if (isNetworkError) {
      message = 'Unable to connect to the server. Please check your internet connection.'
    } else {
      message = error.message || 'An unexpected error occurred. Please try again.'
    }

    return Promise.reject(new Error(message))
  }
)

export default graphqlClient
