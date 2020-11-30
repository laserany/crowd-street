import App from './App'
import InvestmentFormRequest from './components/InvestmentFormRequest'
import InvestmentFormResponse from './components/InvestmentFormResponse'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {}
const store = mockStore(initialState)

test('assert that App Component has InvestmentFormRequest and InvestmentFormResponse components ', () => {
  const appRenderer = TestRenderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  )

  const appChildComponents = appRenderer.toTree().rendered['type']().props
    .children
  expect(appChildComponents[0]['type']).toEqual(InvestmentFormRequest)
  expect(appChildComponents[1]['type']).toEqual(InvestmentFormResponse)
})
