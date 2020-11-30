import { createSlice } from '@reduxjs/toolkit'

//this state is used to determine whether the applicant sent a bad request or not. Accepts true or false
const BadRequestSlice = createSlice({
  name: 'badRequest',
  initialState: false,
  reducers: {
    setBadRequest: (state, action) => action.payload,
  },
})

export const { setBadRequest } = BadRequestSlice.actions

export default BadRequestSlice
