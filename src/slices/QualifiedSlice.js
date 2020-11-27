import { createSlice } from '@reduxjs/toolkit'

const QualifiedSlice = createSlice({
  name: 'qualified',
  initialState: false,
  reducers: {
    setQualified: (state, action) => action.payload,
  },
})

export const { setQualified } = QualifiedSlice.actions

export default QualifiedSlice
