import { render, screen } from '@testing-library/react'
import InvestmentForm from './InvestmentForm'

test('assert that InvestmentForm Component has correct placeholders', () => {
  const investmentForm = render(<InvestmentForm />)
  expect(investmentForm.getByPlaceholderText('Investment Amount')).toBeDefined()
  expect(investmentForm.getByPlaceholderText('Investment Type')).toBeDefined()
  expect(investmentForm.getByPlaceholderText('Total Net Worth')).toBeDefined()
  expect(
    investmentForm.getByPlaceholderText('Estimated Yearly Income')
  ).toBeDefined()
  expect(
    investmentForm.getByPlaceholderText('Estimated Credit Score')
  ).toBeDefined()
})

test('asset that InvestmentForm has the right elements', () => {
  const investmentForm = render(<InvestmentForm />)
  const allTextBoxes = investmentForm.getAllByRole('textbox')
  expect(5).toEqual(allTextBoxes.length)
  expect('formHorizontalInvestmentAmount').toEqual(allTextBoxes[0].id)
  expect('formHorizontalInvestmentType').toEqual(allTextBoxes[1].id)
  expect('formHorizontalTotalNetWorth').toEqual(allTextBoxes[2].id)
  expect('formHorizontalEstimatedYearlyIncome').toEqual(allTextBoxes[3].id)
  expect('formHorizontalEstimatedCreditScore').toEqual(allTextBoxes[4].id)
  expect(investmentForm.getByRole('button')).toBeDefined()
})
