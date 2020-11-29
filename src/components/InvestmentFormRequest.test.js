import { render, fireEvent, waitFor, act } from '@testing-library/react'
import InvestmentFormRequest from './InvestmentFormRequest'
import investmentFormSubmitter from './InvestmentFormRequest.test.helper'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import * as redux from 'react-redux'
import jest from 'jest-mock'
import { jest as global_jest } from '@jest/globals'
import fetchMock from 'fetch-mock'
import { setQualified } from '../slices/QualifiedSlice'
import { setBadRequest } from '../slices/BadRequestSlice'
import { setShow } from '../slices/ShowSlice'

let investmentFormRequest

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {}
const store = mockStore(initialState)

beforeEach(() => {
  global_jest.useFakeTimers()
  investmentFormRequest = render(
    <Provider store={store}>
      <InvestmentFormRequest />
    </Provider>
  )
})

test('assert that InvestmentForm Component has correct placeholders', () => {
  expect(
    investmentFormRequest.getByPlaceholderText('Investment Amount')
  ).toBeDefined()
  expect(
    investmentFormRequest.getByPlaceholderText('Investment Type')
  ).toBeDefined()
  expect(
    investmentFormRequest.getByPlaceholderText('Total Net Worth')
  ).toBeDefined()
  expect(
    investmentFormRequest.getByPlaceholderText('Estimated Yearly Income')
  ).toBeDefined()
  expect(
    investmentFormRequest.getByPlaceholderText('Estimated Credit Score')
  ).toBeDefined()
})

test('assert that InvestmentForm has the right elements', () => {
  const formFields = investmentFormRequest.getAllByRole('textbox')
  expect(5).toEqual(formFields.length)
  expect('formHorizontalInvestmentAmount').toEqual(formFields[0].id)
  expect('formHorizontalInvestmentType').toEqual(formFields[1].id)
  expect('formHorizontalTotalNetWorth').toEqual(formFields[2].id)
  expect('formHorizontalEstimatedYearlyIncome').toEqual(formFields[3].id)
  expect('formHorizontalEstimatedCreditScore').toEqual(formFields[4].id)
  expect(investmentFormRequest.getByRole('button')).toBeDefined()
})

test('assert that all currency inputs are prepended with a dolar sign', () => {
  const inputGroups = investmentFormRequest.container.querySelectorAll(
    '.input-group'
  )
  expect(inputGroups[0].children[1]).toEqual(
    investmentFormRequest.getByPlaceholderText('Investment Amount')
  )
  expect(inputGroups[1].children[1]).toEqual(
    investmentFormRequest.getByPlaceholderText('Total Net Worth')
  )
  expect(inputGroups[2].children[1]).toEqual(
    investmentFormRequest.getByPlaceholderText('Estimated Yearly Income')
  )
})

test('assert that all form fields are required and invalid feedback is provided', async () => {
  const button = investmentFormRequest.getByRole('button')
  await waitFor(() => fireEvent.click(button))
  const invalidFeedbacks = investmentFormRequest.container.querySelectorAll(
    '.invalid-feedback'
  )
  expect(invalidFeedbacks.length).toEqual(5)
  invalidFeedbacks.forEach((invalidFeedback) =>
    expect(invalidFeedback.innerHTML).toContain('is a required field')
  )
})

test('assert that valid feedback is provided for form fields that pass validation', async () => {
  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  const validFeedbacks = investmentFormRequest.container.querySelectorAll(
    '.valid-feedback'
  )
  expect(validFeedbacks.length).toEqual(5)
  validFeedbacks.forEach((validFeedback) =>
    expect(validFeedback.innerHTML).toEqual('Looks good!')
  )
  const invalidFeedbacks = investmentFormRequest.container.querySelectorAll(
    '.invalid-feedback'
  )
  expect(invalidFeedbacks.length).toEqual(5)
  invalidFeedbacks.forEach((invalidFeedback) =>
    expect(invalidFeedback.innerHTML).toEqual('')
  )
})

test('assert that all currency inputs are in dollar format', async () => {
  await investmentFormSubmitter(
    investmentFormRequest,
    'invalidInvestmentAmount',
    'testInvestmentType',
    'invalidTotalNetWorthAmount',
    'invalidEstimatedYearlyIncome',
    '700'
  )

  const investmentAmountInvalidFeedback = investmentFormRequest.container.querySelector(
    '#formHorizontalInvestmentAmount + .valid-feedback + .invalid-feedback'
  )
  const totalNetWorthInvalidFeedback = investmentFormRequest.container.querySelector(
    '#formHorizontalTotalNetWorth + .valid-feedback + .invalid-feedback'
  )
  const estimatedYearlyIncomeInvalidFeedback = investmentFormRequest.container.querySelector(
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
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '200'
  )
  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  const creditScoreInvalidFeedback = investmentFormRequest.container.querySelector(
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
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenLastCalledWith(setQualified(true))

  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '4000',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenLastCalledWith(setQualified(false))

  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '500'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenLastCalledWith(setQualified(false))

  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '30000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenLastCalledWith(setQualified(false))
})

test('assert that button changes to spinner when clicked', async () => {
  expect(
    investmentFormRequest.queryByRole('button', { name: 'Apply Now' })
  ).toBeDefined()
  expect(
    investmentFormRequest.queryByRole('button', { name: 'Please wait...' })
  ).toBeNull()
  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  expect(
    investmentFormRequest.queryByRole('button', { name: 'Apply Now' })
  ).toBeNull()
  expect(
    investmentFormRequest.queryByRole('button', { name: 'Please wait...' })
  ).toBeDefined()

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(
    investmentFormRequest.queryByRole('button', { name: 'Apply Now' })
  ).toBeDefined()
  expect(
    investmentFormRequest.queryByRole('button', { name: 'Please wait...' })
  ).toBeNull()
})

test('assert that backend is called when form is submitted', async () => {
  const fetchMockSpy = jest.spyOn(fetchMock, 'post')
  await investmentFormSubmitter(
    investmentFormRequest,
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

test('assert that badRequest status is set to true when Investment Amount is over 9 million', async () => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)

  await investmentFormSubmitter(
    investmentFormRequest,
    '100000000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenLastCalledWith(setBadRequest(true))
})

test('assert that show status is always set to true whenever a form has been submitted successfully', async () => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)

  await investmentFormSubmitter(
    investmentFormRequest,
    '1000.00',
    'testInvestmentType',
    '50000',
    '25000.50',
    '700'
  )

  await act(async () => {
    global_jest.advanceTimersByTime(2000)
  })

  expect(mockDispatchFn).toHaveBeenCalledWith(setShow(true))
})
