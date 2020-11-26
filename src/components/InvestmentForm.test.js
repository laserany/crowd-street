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

test('assert that InvestmentForm has the right elements', () => {
  const investmentForm = render(<InvestmentForm />)
  const formFields = investmentForm.getAllByRole('textbox')
  expect(5).toEqual(formFields.length)
  expect('formHorizontalInvestmentAmount').toEqual(formFields[0].id)
  expect('formHorizontalInvestmentType').toEqual(formFields[1].id)
  expect('formHorizontalTotalNetWorth').toEqual(formFields[2].id)
  expect('formHorizontalEstimatedYearlyIncome').toEqual(formFields[3].id)
  expect('formHorizontalEstimatedCreditScore').toEqual(formFields[4].id)
  expect(investmentForm.getByRole('button')).toBeDefined()
})

test('assert that all form fields are required', () => {
  const investmentForm = render(<InvestmentForm />)
  const formFields = investmentForm.getAllByRole('textbox')
  expect(formFields.every((i) => i.required)).toBeTruthy()
})

test('assert that all currency inputs are prepended with a dolar sign', () => {
  const investmentForm = render(<InvestmentForm />)
  const inputGroups = investmentForm.container.querySelectorAll('.input-group')
  expect(inputGroups[0].children[1]).toEqual(
    investmentForm.getByPlaceholderText('Investment Amount')
  )
  expect(inputGroups[1].children[1]).toEqual(
    investmentForm.getByPlaceholderText('Total Net Worth')
  )
  expect(inputGroups[2].children[1]).toEqual(
    investmentForm.getByPlaceholderText('Estimated Yearly Income')
  )
})
