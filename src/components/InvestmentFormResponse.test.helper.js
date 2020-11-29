import { render, queries, queryHelpers } from '@testing-library/react'

const queryById = queryHelpers.queryByAttribute.bind(null, 'id')

export default function customRender(ui, options) {
  return render(ui, { queries: { ...queries, queryById }, ...options })
}
