'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { store } from '@/lib/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <>{children}
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
        </>
      </QueryClientProvider>
    </Provider>
  )
}
