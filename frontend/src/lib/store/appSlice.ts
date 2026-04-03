import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  sidebarOpen: boolean
  searchQuery: string
}

const initialState: AppState = {
  sidebarOpen: true,
  searchQuery: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setSidebarOpen, toggleSidebar, setSearchQuery } = appSlice.actions
export default appSlice.reducer
