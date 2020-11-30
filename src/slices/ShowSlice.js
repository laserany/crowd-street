import { createSlice } from '@reduxjs/toolkit'

//this state is used to determine whether the response modal should be shown or hidden. Accepts true or false
const ShowSlice = createSlice({
  name: 'show',
  initialState: false,
  reducers: {
    setShow: (state, action) => action.payload,
  },
})

export const { setShow } = ShowSlice.actions

export default ShowSlice
