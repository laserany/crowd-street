import React from 'react'
import './InvestmentForm.css'
import { Form, InputGroup, Row, Col, Button } from 'react-bootstrap'

const InvestmentForm = () => {
  return (
    <Form className='mt-6'>
      <Form.Group as={Row} controlId='formHorizontalInvestmentAmount'>
        <Col sm={8}></Col>
        <Col sm={3}>
          <InputGroup className='mb-3'>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control required placeholder='Investment Amount' />
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId='formHorizontalInvestmentType'>
        <Col sm={8}></Col>
        <Col sm={3}>
          <Form.Control required placeholder='Investment Type' />
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
            <Form.Control required placeholder='Total Net Worth' />
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
            <Form.Control required placeholder='Estimated Yearly Income' />
          </InputGroup>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId='formHorizontalEstimatedCreditScore'>
        <Col sm={8}></Col>
        <Col sm={3}>
          <Form.Control required placeholder='Estimated Credit Score' />
          <Form.Text className='text-white'>Number from 300-850</Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId='formHorizontalSubmitButton'>
        <Col sm={8}></Col>
        <Col sm={3}>
          <Button variant='light'>Apply Now</Button>
        </Col>
      </Form.Group>
    </Form>
  )
}

export default InvestmentForm
