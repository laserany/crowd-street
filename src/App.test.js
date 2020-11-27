import App from './App'
import InvestmentForm from './components/InvestmentForm'
import MyVerticallyCenteredModal from './components/MyVerticallyCenteredModal'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import DisqualificationPage from './components/DisqualificationPage'

const middlewares = []
const mockStore = configureStore(middlewares)
const initialState = {}
const store = mockStore(initialState)

test('assert that App Component has InvestmentForm, new Account Creation Page And Disqualification Page', () => {
  const appRenderer = TestRenderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  )

  const appChildComponents = appRenderer.toTree().rendered['type']().props
    .children
  expect(appChildComponents[0]['type']).toEqual(InvestmentForm)
  expect(appChildComponents[1]['type']).toEqual(MyVerticallyCenteredModal)
  expect(appChildComponents[2]['type']).toEqual(DisqualificationPage)
})
