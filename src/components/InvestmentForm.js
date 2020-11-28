import React, { useState, useEffect } from 'react'
import './InvestmentForm.css'
import { Form, InputGroup, Row, Col, Button, Spinner } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { setQualified } from '../slices/QualifiedSlice'
import { useDispatch } from 'react-redux'
import isQualified from './InvestmentForm.helper'
import fetchMock from 'fetch-mock-jest'

const schema = Yup.object({
  investmentAmount: Yup.string()
    .required()
    .matches(
      '^(\\d+(\\.\\d{2})?)$',
      'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
    ),
  investmentType: Yup.string().required(),
  totalNetWorth: Yup.string()
    .required()
    .matches(
      '^(\\d+(\\.\\d{2})?)$',
      'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
    ),
  estimatedYearlyIncome: Yup.string()
    .required()
    .matches(
      '^(\\d+(\\.\\d{2})?)$',
      'Invalid input! please provide input in correct format(e.g 1000.00 or 1000)'
    ),
  estimatedCreditScore: Yup.string()
    .required()
    .matches(
      '^(([3-7]\\d{2})|(8[0-4]\\d)|(850))$',
      'Invalid input! Credit score must be a number between 300 and 850'
    ),
})

const InvestmentForm = () => {
  var formValues = {}

  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    if (spinner) {
      setTimeout(() => {
        setSpinner(false)
        fetchMock.post(
          'https://www.crowdstreets.com/backend',
          new Promise((resolve, reject) => {
            resolve({
              body: isQualified(window.formValues)
                ? 'Qualified'
                : 'Disqualified',
              status: 200,
            })
          }).then((response) => {
            response.body === 'Qualified' && dispatch(setQualified(true))
          }),
          { overwriteRoutes: false }
        )
      }, 2000)
    }
  }, [spinner])

  const dispatch = useDispatch()

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          window.formValues = values
          setSpinner(true)
        }}
        initialValues={{
          investmentAmount: '',
          investmentType: '',
          totalNetWorth: '',
          estimatedYearlyIncome: '',
          estimatedCreditScore: '',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
          values,
          errors,
        }) => (
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
                    onBlur={handleBlur}
                    isValid={
                      touched.investmentAmount && !errors.investmentAmount
                    }
                    isInvalid={
                      touched.investmentAmount && !!errors.investmentAmount
                    }
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
                  onBlur={handleBlur}
                  isValid={touched.investmentType && !errors.investmentType}
                  isInvalid={touched.investmentType && !!errors.investmentType}
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
                    onBlur={handleBlur}
                    isValid={touched.totalNetWorth && !errors.totalNetWorth}
                    isInvalid={touched.totalNetWorth && !!errors.totalNetWorth}
                    placeholder='Total Net Worth'
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>
                    {errors.totalNetWorth}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              controlId='formHorizontalEstimatedYearlyIncome'
            >
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
                    onBlur={handleBlur}
                    isValid={
                      touched.estimatedYearlyIncome &&
                      !errors.estimatedYearlyIncome
                    }
                    isInvalid={
                      touched.estimatedYearlyIncome &&
                      !!errors.estimatedYearlyIncome
                    }
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
                  onBlur={handleBlur}
                  isValid={
                    touched.estimatedCreditScore && !errors.estimatedCreditScore
                  }
                  isInvalid={
                    touched.estimatedCreditScore &&
                    !!errors.estimatedCreditScore
                  }
                  placeholder='Estimated Credit Score'
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>
                  {errors.estimatedCreditScore}
                </Form.Control.Feedback>
                <Form.Text className='text-white'>
                  Number from 300-850
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formHorizontalSubmitButton'>
              <Col sm={8}></Col>
              <Col sm={3}>
                {spinner ? (
                  <Button variant='light' disabled>
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                    Please wait...
                  </Button>
                ) : (
                  <Button variant='light' type='submit'>
                    Apply Now
                  </Button>
                )}
              </Col>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default InvestmentForm
