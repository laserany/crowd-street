import InvestmentFormResponse from './InvestmentFormResponse'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { screen, getNodeText, waitFor, fireEvent } from '@testing-library/react'
import render, {
  accountCreationFormSubmitter,
} from './InvestmentFormResponse.test.helper'
import * as react from 'react'
import * as redux from 'react-redux'
import { setQualified } from '../slices/QualifiedSlice'
import { setBadRequest } from '../slices/BadRequestSlice'
import { setShow } from '../slices/ShowSlice'

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
    'Your application has been denied. We apologize for any inconvenience. Please contact customer service at 515-850-2047 or by email at Mustafa_Abusharkh@protonmail.com. Thank you.'
  )

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    investmentFormResponse.queryById('formHorizontalUserName')
  ).toBeInTheDocument()
  expect(
    investmentFormResponse.queryById('formHorizontalPassword')
  ).toBeInTheDocument()
  expect(
    investmentFormResponse.queryById('formHorizontalConfirmPassword')
  ).toBeInTheDocument()

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
  const setSubmittedMock = jest.fn()
  const useStateMock = (initState) => [initState, setSubmittedMock]
  const setSubmittedSpy = jest
    .spyOn(react, 'useState')
    .mockImplementation(useStateMock)
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreet.com',
    'password1234',
    'password1234'
  )
  expect(setSubmittedMock).toHaveBeenCalledWith(true)
  setSubmittedSpy.mockRestore()
})

test('validate userName input', async () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  await accountCreationFormSubmitter(
    investmentFormResponse,
    '',
    'password1234',
    'password1234'
  )

  expect(
    investmentFormResponse.getByText('userName is a required field')
  ).toBeDefined()

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa1234',
    'password1234',
    'password1234'
  )

  expect(
    investmentFormResponse.getByText(
      'Invalid username! Please provide a valid username (e.g johndoe@example.com)'
    )
  ).toBeDefined()
})

test('validate password input', async () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreet.com',
    '',
    'pass1234'
  )

  expect(
    investmentFormResponse.getByText('password is a required field')
  ).toBeDefined()

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreet.com',
    'pass1234',
    'pass1234'
  )

  expect(
    investmentFormResponse.getByText('Password must be more than 8 digits')
  ).toBeDefined()

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreet.com',
    'mustafapassword',
    'mustafapassword'
  )

  expect(
    investmentFormResponse.getByText(
      'Password must include atleast one Number or Special Character'
    )
  ).toBeDefined()
})

test('validate confirmPassword input', async () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  await accountCreationFormSubmitter(
    investmentFormResponse,
    'mustafa@crowdstreet.com',
    'password1234',
    ''
  )

  expect(
    investmentFormResponse.getByText('confirmPassword is a required field')
  ).toBeDefined()

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'mustafa@crowdstreet.com',
    'password1234',
    'password5678'
  )

  expect(
    investmentFormResponse.getByText('Password does not match')
  ).toBeDefined()
})

test('assert that successful message is being displayed when form is submitted', async () => {
  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  await accountCreationFormSubmitter(
    investmentFormResponse,
    'Mustafa@crowdstreet.com',
    'password1234',
    'password1234'
  )

  expect(getNodeText(investmentFormResponse.getByRole('heading'))).toEqual(
    'Thank you!'
  )
  expect(
    getNodeText(investmentFormResponse.queryByText(/.*/, { selector: 'p' }))
  ).toEqual('Your account has been created. You may now close the window.')
})

test('assert that all states are reset when closing modal', async () => {
  const setSubmittedMock = jest.fn()
  const useStateMock = (initState) => [initState, setSubmittedMock]
  const setSubmittedSpy = jest
    .spyOn(react, 'useState')
    .mockImplementation(useStateMock)
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)
  const location = new URL('https://www.example.com')
  location.replace = jest.fn()
  delete window.location
  window.location = location

  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  const button = investmentFormResponse.getByRole('button')

  await waitFor(() => fireEvent.click(button))

  expect(setSubmittedMock).toHaveBeenCalledWith(false)
  expect(mockDispatchFn).toHaveBeenCalledWith(setQualified(false))
  expect(mockDispatchFn).toHaveBeenCalledWith(setBadRequest(false))
  expect(mockDispatchFn).toHaveBeenCalledWith(setShow(false))
  expect(location.replace).toHaveBeenCalledWith('https://www.crowdstreet.com/')

  setSubmittedSpy.mockRestore()
})
