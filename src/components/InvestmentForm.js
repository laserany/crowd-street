import React from 'react'
import './InvestmentForm.css'
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'

const schema = Yup.object({
  investmentAmount: Yup.string().required(),
  investmentType: Yup.string().required(),
  totalNetWorth: Yup.string().required(),
  estimatedYearlyIncome: Yup.string().required(),
  estimatedCreditScore: Yup.string().required(),
})

const InvestmentForm = () => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      initialValues={{
        investmentAmount: '',
        investmentType: '',
        totalNetWorth: '',
        estimatedYearlyIncome: '',
        estimatedCreditScore: '',
      }}
    >
      {({ handleSubmit, handleChange, touched, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit} className='mt-6'>
          <Form.Group as={Row} controlId='formHorizontalInvestmentAmount'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <InputGroup className='mb-3'>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='investmentAmount'
                  value={values.investmentAmount}
                  onChange={handleChange}
                  isValid={touched.investmentAmount && !errors.investmentAmount}
                  isInvalid={!!errors.investmentAmount}
                  placeholder='Investment Amount'
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  {errors.investmentAmount}
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId='formHorizontalInvestmentType'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <Form.Control
                name='investmentType'
                value={values.investmentType}
                onChange={handleChange}
                isValid={touched.investmentType && !errors.investmentType}
                isInvalid={!!errors.investmentType}
                placeholder='Investment Type'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                {errors.investmentType}
              </Form.Control.Feedback>
              <Form.Text className='text-white'>
                Bond, Stocks, Real Estate etc.
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId='formHorizontalTotalNetWorth'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <InputGroup className='mb-3'>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='totalNetWorth'
                  value={values.totalNetWorth}
                  onChange={handleChange}
                  isValid={touched.totalNetWorth && !errors.totalNetWorth}
                  isInvalid={!!errors.totalNetWorth}
                  placeholder='Total Net Worth'
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  {errors.totalNetWorth}
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId='formHorizontalEstimatedYearlyIncome'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <InputGroup className='mb-3'>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='estimatedYearlyIncome'
                  value={values.estimatedYearlyIncome}
                  onChange={handleChange}
                  isValid={
                    touched.estimatedYearlyIncome &&
                    !errors.estimatedYearlyIncome
                  }
                  isInvalid={!!errors.estimatedYearlyIncome}
                  placeholder='Estimated Yearly Income'
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  {errors.estimatedYearlyIncome}
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId='formHorizontalEstimatedCreditScore'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <Form.Control
                name='estimatedCreditScore'
                value={values.estimatedCreditScore}
                onChange={handleChange}
                isValid={
                  touched.estimatedCreditScore && !errors.estimatedCreditScore
                }
                isInvalid={!!errors.estimatedCreditScore}
                placeholder='Estimated Credit Score'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                {errors.estimatedCreditScore}
              </Form.Control.Feedback>
              <Form.Text className='text-white'>Number from 300-850</Form.Text>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId='formHorizontalSubmitButton'>
            <Col sm={8}></Col>
            <Col sm={3}>
              <Button variant='light' type='submit'>
                Apply Now
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Formik>
  )
}

export default InvestmentForm
