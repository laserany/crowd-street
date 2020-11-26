import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import InvestmentForm from './InvestmentForm'

let investmentForm
window.alert = jest.fn()

beforeEach(() => {
  investmentForm = render(<InvestmentForm />)
})

test('assert that InvestmentForm Component has correct placeholders', () => {
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
  const formFields = investmentForm.getAllByRole('textbox')
  expect(5).toEqual(formFields.length)
  expect('formHorizontalInvestmentAmount').toEqual(formFields[0].id)
  expect('formHorizontalInvestmentType').toEqual(formFields[1].id)
  expect('formHorizontalTotalNetWorth').toEqual(formFields[2].id)
  expect('formHorizontalEstimatedYearlyIncome').toEqual(formFields[3].id)
  expect('formHorizontalEstimatedCreditScore').toEqual(formFields[4].id)
  expect(investmentForm.getByRole('button')).toBeDefined()
})

test('assert that all currency inputs are prepended with a dolar sign', () => {
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

test('assert that all form fields are required and invalid feedback is provided', async () => {
  const button = investmentForm.getByRole('button')
  await waitFor(() => fireEvent.click(button))
  const invalidFeedbacks = investmentForm.container.querySelectorAll(
    '.invalid-feedback'
  )
  expect(invalidFeedbacks.length).toEqual(5)
  invalidFeedbacks.forEach((invalidFeedback) =>
    expect(invalidFeedback.innerHTML).toContain('is a required field')
  )
})

test('assert that valid feedback is provided for form fields that pass validation', async () => {
  const investmentFormContainer = investmentForm.container

  const investmentAmount = investmentFormContainer.querySelector(
    '#formHorizontalInvestmentAmount'
  )
  const investmentType = investmentFormContainer.querySelector(
    '#formHorizontalInvestmentType'
  )
  const totalNetWorth = investmentFormContainer.querySelector(
    '#formHorizontalTotalNetWorth'
  )
  const estimatedYearlyIncome = investmentFormContainer.querySelector(
    '#formHorizontalEstimatedYearlyIncome'
  )
  const estimatedCreditScore = investmentFormContainer.querySelector(
    '#formHorizontalEstimatedCreditScore'
  )

  await waitFor(() => {
    fireEvent.change(investmentAmount, {
      target: {
        value: 'testInvestmentAmount',
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(investmentType, {
      target: {
        value: 'testInvestmentType',
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(totalNetWorth, {
      target: {
        value: 'testTotalNetWorth',
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(estimatedYearlyIncome, {
      target: {
        value: 'testEstimatedYearlyIncome',
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(estimatedCreditScore, {
      target: {
        value: 'testEstimatedCreditScore',
      },
    })
  })
  const button = investmentForm.getByRole('button')
  await waitFor(() => fireEvent.click(button))
  const validFeedbacks = investmentForm.container.querySelectorAll(
    '.valid-feedback'
  )
  expect(validFeedbacks.length).toEqual(5)
  validFeedbacks.forEach((validFeedback) =>
    expect(validFeedback.innerHTML).toEqual('Looks good!')
  )
  const invalidFeedbacks = investmentForm.container.querySelectorAll(
    '.invalid-feedback'
  )
  expect(invalidFeedbacks.length).toEqual(5)
  invalidFeedbacks.forEach((invalidFeedback) =>
    expect(invalidFeedback.innerHTML).toEqual('')
  )
})
