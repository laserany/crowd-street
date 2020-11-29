import { createSlice } from '@reduxjs/toolkit'

const ShowSlice = createSlice({
  name: 'show',
  initialState: false,
  reducers: {
    setShow: (state, action) => action.payload,
  },
})

export const { setShow } = ShowSlice.actions

export default ShowSlice
