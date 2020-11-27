export default function isQualified(values) {
  const investmentAmount = Number(values['investmentAmount'])
  const totalNetWorth = Number(values['totalNetWorth'])
  const estimatedYearlyIncome = Number(values['estimatedYearlyIncome'])
  const estimatedCreditScore = Number(values['estimatedCreditScore'])
  return !(
    investmentAmount > 0.2 * estimatedYearlyIncome ||
    estimatedCreditScore < 600 ||
    investmentAmount > 0.03 * totalNetWorth
  )
}
