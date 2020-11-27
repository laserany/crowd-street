import React from 'react'
import './App.css'
import DisqualificationPage from './components/DisqualificationPage'
import InvestmentForm from './components/InvestmentForm'
import MyVerticallyCenteredModal from './components/MyVerticallyCenteredModal'

const App = () => {
  return (
    <>
      <InvestmentForm />
      <MyVerticallyCenteredModal />
      <DisqualificationPage />
    </>
  )
}

export default App
