import InvestmentFormResponse from './InvestmentFormResponse'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { screen, getNodeText } from '@testing-library/react'
import render from './InvestmentFormResponse.test.helper'

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

  expect(
    getNodeText(
      investmentFormResponse.queryByText(
        (content, element) =>
          element.tagName === 'H4' &&
          element.parentElement.className === 'modal-body'
      )
    )
  ).toEqual('Sorry')

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryByText(
        (content, element) =>
          element.tagName === 'H4' &&
          element.parentElement.className === 'modal-body'
      )
    )
  ).toEqual('Congratulations! You have been qualified')

  initialState = { show: true, qualified: false, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryByText(
        (content, element) =>
          element.tagName === 'H4' &&
          element.parentElement.className === 'modal-body'
      )
    )
  ).toEqual('Investment Amount is too big')

  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    getNodeText(
      investmentFormResponse.queryByText(
        (content, element) =>
          element.tagName === 'H4' &&
          element.parentElement.className === 'modal-body'
      )
    )
  ).toEqual('Investment Amount is too big')
})

test('assert that backdrop to static if not a bad request', () => {
  initialState = { show: true, qualified: false, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse = render(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  expect(
    investmentFormResponse.queryByText(
      (content, element) => element.className === 'fade modal-backdrop show'
    )
  ).toBeDefined()

  initialState = { show: true, qualified: false, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )

  screen.debug()

  expect(
    investmentFormResponse.queryByText(
      (content, element) => element.className === 'fade modal-backdrop show'
    )
  ).toBeNull()

  initialState = { show: true, qualified: true, badRequest: false }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  expect(
    investmentFormResponse.queryByText(
      (content, element) => element.className === 'fade modal-backdrop show'
    )
  ).toBeDefined()

  initialState = { show: true, qualified: true, badRequest: true }
  store = mockStore(initialState)
  investmentFormResponse.rerender(
    <Provider store={store}>
      <InvestmentFormResponse />
    </Provider>
  )
  expect(
    investmentFormResponse.queryByText(
      (content, element) => element.className === 'fade modal-backdrop show'
    )
  ).toBeNull()
})
