import React, { useState } from 'react'
import './InvestmentFormResponse.css'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../slices/ShowSlice'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { setQualified } from '../slices/QualifiedSlice'
import { setBadRequest } from '../slices/BadRequestSlice'

const schema = Yup.object({
  userName: Yup.string()
    .required()
    .matches(
      '^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4})$',
      'Invalid username! Please provide a valid username (e.g johndoe@example.com)'
    ),
  password: Yup.string()
    .required()
    .min(9, 'Password must be more than 8 digits')
    .matches(
      '^(.*[\\d !"#$%&\'()*+\\,\\-./:;<=>?@[\\\\\\]^_`{|}~]+.*)$',
      'Password must include atleast one Number or Special Character'
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Password does not match'),
})

const InvestmentFormResponse = () => {
  const [submitted, setSubmitted] = useState(false)
  const qualified = useSelector((state) => state.qualified)
  const badRequest = useSelector((state) => state.badRequest)
  const show = useSelector((state) => state.show)
  const dispatch = useDispatch()
  return (
    <Modal
      show={show}
      onHide={() => {
        setSubmitted(false)
        dispatch(setQualified(false))
        dispatch(setBadRequest(false))
        dispatch(setShow(false))
        window.location.replace('https://www.crowdstreet.com/')
      }}
      backdrop={badRequest ? true : 'static'}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {badRequest
            ? 'Bad Request'
            : qualified
            ? 'Qualified'
            : 'Disqualified'}
        </Modal.Title>
      </Modal.Header>
      {submitted ? (
        <Modal.Body>
          <h4>Thank you!</h4>
          <p>Your account has been created. You may now close the window.</p>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h4>
            {badRequest
              ? 'Investment Amount is too big'
              : qualified
              ? 'Congratulations! You have been qualified'
              : 'Sorry'}
          </h4>
          {qualified ? (
            <Formik
              validationSchema={schema}
              onSubmit={(values) => setSubmitted(true)}
              initialValues={{
                userName: '',
                password: '',
                confirmPassword: '',
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
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group as={Row} controlId='formHorizontalUserName'>
                    <Col>
                      <Form.Label>User name</Form.Label>
                      <Form.Control
                        name='userName'
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.userName && !errors.userName}
                        isInvalid={touched.userName && !!errors.userName}
                        placeholder='Enter User name'
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'>
                        {errors.userName}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId='formHorizontalPassword'>
                    <Col>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.password && !errors.password}
                        isInvalid={touched.password && !!errors.password}
                        placeholder='Enter Password'
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId='formHorizontalConfirmPassword'
                  >
                    <Col>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        name='confirmPassword'
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={
                          touched.confirmPassword && !errors.confirmPassword
                        }
                        isInvalid={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
                        placeholder='Re-type your Password'
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'>
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId='formHorizontalSubmitButton'>
                    <Col>
                      <Button variant='primary' type='submit'>
                        Create new Account!
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          ) : badRequest ? (
            <p>
              Please revisit your investment application form and correct the
              investment amount.
            </p>
          ) : (
            <p>
              Your application has been denied. We apologize for any
              inconvenience. Please consider reconsider applying in the future
              and thank you.
            </p>
          )}
        </Modal.Body>
      )}
    </Modal>
  )
}

export default InvestmentFormResponse
