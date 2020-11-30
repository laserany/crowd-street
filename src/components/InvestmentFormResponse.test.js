import InvestmentFormResponse from './InvestmentFormResponse'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { screen, getNodeText, waitFor, fireEvent } from '@testing-library/react'
import render, {
  accountCreationFormSubmitter,
} from './InvestmentFormResponse.test.helper'
import * as react from 'react'

let investmentFormResponse
let initialState
let store
const middlewares = []
const mockStore = configureStore(middlewares)

test('assert that Modal is only shown when show state is set to true', () => {
  initialState = { show: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(investmentFormResponse.queryByRole('dialog')).toBeNull()

  initialState = { show: true }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(investmentFormResponse.queryByRole('dialog')).toBeDefined()
})

test('assert that Modal Title is set based on the qualified and badRequest states', () => {
  initialState = { show: true, qualified: false, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryById('contained-modal-title-vcenter')
    )
  ).toEqual('Disqualified')

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryById('contained-modal-title-vcenter')
    )
  ).toEqual('Qualified')

  initialState = { show: true, qualified: false, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryById('contained-modal-title-vcenter')
    )
  ).toEqual('Bad Request')

  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryById('contained-modal-title-vcenter')
    )
  ).toEqual('Bad Request')
})

test('assert that Modal Body Header is set based on the qualified and badRequest states', () => {
  initialState = { show: true, qualified: false, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(getNodeText(investmentFormResponse.getByRole('heading'))).toEqual(
    'Sorry'
  )

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(getNodeText(investmentFormResponse.getByRole('heading'))).toEqual(
    'Congratulations! You have been qualified'
  )

  initialState = { show: true, qualified: false, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(getNodeText(investmentFormResponse.getByRole('heading'))).toEqual(
    'Investment Amount is too big'
  )

  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(getNodeText(investmentFormResponse.getByRole('heading'))).toEqual(
    'Investment Amount is too big'
  )
})

test('assert that Modal Body Content is set based on the qualified and badRequest states', () => {
  initialState = { show: true, qualified: false, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(investmentFormResponse.queryByText(/.*/, { selector: 'p' }))
  ).toEqual(
    'Your application has been denied. We apologize for any inconvenience. Please consider reconsider applying in the future and thank you.'
  )

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  let formFields = investmentFormResponse.getAllByRole('textbox')

  expect(formFields[0].id).toEqual('formHorizontalUserName')
  expect(formFields[1].id).toEqual('formHorizontalPassword')
  expect(formFields[2].id).toEqual('formHorizontalConfirmPassword')

  initialState = { show: true, qualified: false, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  expect(
    getNodeText(investmentFormResponse.queryByText(/.*/, { selector: 'p' }))
  ).toEqual(
    'Please revisit your investment application form and correct the investment amount.'
  )
  ;('')
  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  expect(
    getNodeText(investmentFormResponse.queryByText(/.*/, { selector: 'p' }))
  ).toEqual(
    'Please revisit your investment application form and correct the investment amount.'
  )
})

test('assert that the Account Creation form has correct placeholders', () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    investmentFormResponse.getByPlaceholderText('Enter User name')
  ).toBeDefined()
  expect(
    investmentFormResponse.getByPlaceholderText('Enter Password')
  ).toBeDefined()
  expect(
    investmentFormResponse.getByPlaceholderText('Re-type your Password')
  ).toBeDefined()
})

test('assert that all form fields are required and invalid feedback is provided', async () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  const button = investmentFormResponse.getByRole('button', {
    name: 'Create new Account!',
  })

  await waitFor(() => fireEvent.click(button))

  const invalidFeedbacks = investmentFormResponse.queryAllByText(
    'is a required field',
    { exact: false }
  )

  expect(invalidFeedbacks.length).toEqual(3)
})

test('assert that form is submitted successfully for form fields that pass validation', async () => {
  const setSubmitted = jest.fn()
  const useStateMock = (initState) => [initState, setSubmitted]
  jest.spyOn(react, 'useState').mockImplementation(useStateMock)
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreets.com',
    'password1234',
    'password1234'
  )
  expect(setSubmitted).toHaveBeenCalledWith(true)
})
