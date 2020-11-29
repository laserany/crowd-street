import { configureStore } from '@reduxjs/toolkit'
import BadRequestSlice from './slices/BadRequestSlice'
import QualifiedSlice from './slices/QualifiedSlice'
import ShowSlice from './slices/ShowSlice'

const store = configureStore({
  reducer: {
    qualified: QualifiedSlice.reducer,
    badRequest: BadRequestSlice.reducer,
    show: ShowSlice.reducer,
  },
})

export default store
