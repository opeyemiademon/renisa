'use client'

import { ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { store } from '@/lib/store'
import { initAuth } from '@/lib/store/authSlice'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function AuthInitializer({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(initAuth())
  }, [])
  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a6b3a',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#1a6b3a',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#d4a017',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                  color: '#fff',
                },
              },
            }}
          />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  )
}
