import { configureStore } from '@reduxjs/toolkit'
import QualifiedSlice from './slices/QualifiedSlice'

const store = configureStore({
  reducer: { qualified: QualifiedSlice.reducer },
})

export default store
