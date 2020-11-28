import { render, fireEvent, waitFor, act } from '@testing-library/react'
import InvestmentForm from './InvestmentForm'
import investmentFormSubmitter from './InvestmentForm.test.helper'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import * as redux from 'react-redux'
import jest from 'jest-mock'
import { jest as global_jest } from '@jest/globals'
import fetchMock from 'fetch-mock-jest'

let investmentForm

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {}
const store = mockStore(initialState)

beforeEach(() => {
  global_jest.useFakeTimers()
  investmentForm = render(
    <Provider store={store}>
      <InvestmentForm />
    </Provider>
  )
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
  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

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

test('assert that all currency inputs are in dollar format', async () => {
  await investmentFormSubmitter(
    investmentForm,
    'invalidInvestmentAmount',
    'testInvestmentType',
    'invalidTotalNetWorthAmount',
    'invalidEstimatedYearlyIncome',
    '700'
  )

  const investmentAmountInvalidFeedback = investmentForm.container.querySelector(
    '#formHorizontalInvestmentAmount + .valid-feedback + .invalid-feedback'
  )
  const totalNetWorthInvalidFeedback = investmentForm.container.querySelector(
    '#formHorizontalTotalNetWorth + .valid-feedback + .invalid-feedback'
  )
  const estimatedYearlyIncomeInvalidFeedback = investmentForm.container.querySelector(
    '#formHorizontalEstimatedYearlyIncome + .valid-feedback + .invalid-feedback'
  )

  expect(investmentAmountInvalidFeedback.innerHTML).toEqual(
    'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
  )
  expect(totalNetWorthInvalidFeedback.innerHTML).toEqual(
    'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
  )
  expect(estimatedYearlyIncomeInvalidFeedback.innerHTML).toEqual(
    'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
  )
})

test('assert that credit score input is a number between 300-850', async () => {
  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '200'
  )
  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  const creditScoreInvalidFeedback = investmentForm.container.querySelector(
    '#formHorizontalEstimatedCreditScore + .valid-feedback + .invalid-feedback'
  )

  expect(creditScoreInvalidFeedback.innerHTML).toEqual(
    'Invalid input! Credit score must be a number between 300 and 850'
  )
})

test('assert that qualified status is only set to true when conditions are met', async () => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)

  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenCalledTimes(1)

  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '4000',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenCalledTimes(1)

  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '500'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenCalledTimes(1)

  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '30000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenCalledTimes(1)
})

test('assert that button changes to spinner when clicked', async () => {
  expect(
    investmentForm.queryByRole('button', { name: 'Apply Now' })
  ).toBeDefined()
  expect(
    investmentForm.queryByRole('button', { name: 'Please wait...' })
  ).toBeNull()
  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  expect(investmentForm.queryByRole('button', { name: 'Apply Now' })).toBeNull()
  expect(
    investmentForm.queryByRole('button', { name: 'Please wait...' })
  ).toBeDefined()

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(
    investmentForm.queryByRole('button', { name: 'Apply Now' })
  ).toBeDefined()
  expect(
    investmentForm.queryByRole('button', { name: 'Please wait...' })
  ).toBeNull()
})

test('assert that backend is called when form is submitted', async () => {
  const fetchMockSpy = jest.spyOn(fetchMock, 'post')
  await investmentFormSubmitter(
    investmentForm,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })
  expect(
    fetchMockSpy
  ).toHaveBeenCalledWith(
    'https://www.crowdstreets.com/backend',
    new Promise((resolve, reject) => null),
    { method: 'post', overwriteRoutes: false }
  )
})
