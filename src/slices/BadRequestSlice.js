import { createSlice } from '@reduxjs/toolkit'

const BadRequestSlice = createSlice({
  name: 'badRequest',
  initialState: false,
  reducers: {
    setBadRequest: (state, action) => action.payload,
  },
})

export const { setBadRequest } = BadRequestSlice.actions

export default BadRequestSlice
