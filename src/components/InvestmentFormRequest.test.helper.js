import { fireEvent, waitFor } from '@testing-library/react'

//this function is being called by the test class to submit the form via react testing library by clicking the submit button
export default async function investmentFormSubmitter(
  investmentFormRequest,
  investmentAmountInput,
  investmentTypeInput,
  totalNetWorthInput,
  estimatedYearlyIncomeInput,
  estimatedCreditScoreInput
) {
  const investmentFormRequestContainer = investmentFormRequest.container

  const investmentAmount = investmentFormRequestContainer.querySelector(
    '#formHorizontalInvestmentAmount'
  )
  const investmentType = investmentFormRequestContainer.querySelector(
    '#formHorizontalInvestmentType'
  )
  const totalNetWorth = investmentFormRequestContainer.querySelector(
    '#formHorizontalTotalNetWorth'
  )
  const estimatedYearlyIncome = investmentFormRequestContainer.querySelector(
    '#formHorizontalEstimatedYearlyIncome'
  )
  const estimatedCreditScore = investmentFormRequestContainer.querySelector(
    '#formHorizontalEstimatedCreditScore'
  )

  await waitFor(() => {
    fireEvent.change(investmentAmount, {
      target: {
        value: investmentAmountInput,
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(investmentType, {
      target: {
        value: investmentTypeInput,
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(totalNetWorth, {
      target: {
        value: totalNetWorthInput,
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(estimatedYearlyIncome, {
      target: {
        value: estimatedYearlyIncomeInput,
      },
    })
  })
  await waitFor(() => {
    fireEvent.change(estimatedCreditScore, {
      target: {
        value: estimatedCreditScoreInput,
      },
    })
  })
  const button = investmentFormRequest.getByRole('button')
  await waitFor(() => fireEvent.click(button))
}
