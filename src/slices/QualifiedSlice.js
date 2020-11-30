import { createSlice } from '@reduxjs/toolkit'

//this state is used to determine whether the applicant is qualified or not for investment. Accepts true or false
const QualifiedSlice = createSlice({
  name: 'qualified',
  initialState: false,
  reducers: {
    setQualified: (state, action) => action.payload,
  },
})

export const { setQualified } = QualifiedSlice.actions

export default QualifiedSlice
