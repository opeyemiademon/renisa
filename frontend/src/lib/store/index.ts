import { configureStore } from '@reduxjs/toolkit'
import authReducer, { initAuth } from './authSlice'
import appReducer from './appSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
})

// Rehydrate auth from localStorage synchronously at module load time.
// This ensures isAuthenticated is true before any component's useEffect
// runs its guard check, preventing spurious redirects on page reload.
store.dispatch(initAuth())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
