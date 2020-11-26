import { fireEvent, waitFor } from '@testing-library/react'

export default async function investmentFormSubmitter(
  investmentForm,
  investmentAmountInput,
  investmentTypeInput,
  totalNetWorthInput,
  estimatedYearlyIncomeInput,
  estimatedCreditScoreInput
) {
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
  const button = investmentForm.getByRole('button')
  await waitFor(() => fireEvent.click(button))
}
