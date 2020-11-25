import { render, screen } from '@testing-library/react'
import App from './App'
import InvestmentForm from './components/InvestmentForm'
import TestRenderer from 'react-test-renderer'

test('assert that InvestmentForm Component is inside App Component', () => {
  const appRenderer = TestRenderer.create(<App />)
  expect(appRenderer.toTree().rendered['type']).toEqual(InvestmentForm)
})
