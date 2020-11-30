import React, { useState } from 'react'
import './InvestmentFormResponse.css'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../slices/ShowSlice'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { setQualified } from '../slices/QualifiedSlice'
import { setBadRequest } from '../slices/BadRequestSlice'

//schema for account creation form validation
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
  //submitted state identifies if the account creation form was submitted or not
  const [submitted, setSubmitted] = useState(false)
  //qualified state provides state whether the applicant is qualified or not to apply
  const qualified = useSelector((state) => state.qualified)
  //badRequest state is set to true for investments that are larger than 9 millions
  const badRequest = useSelector((state) => state.badRequest)
  //show state is used to show or hide the modal
  const show = useSelector((state) => state.show)
  const dispatch = useDispatch()
  return (
    <Modal
      show={show}
      onHide={() => {
        //this is called when clicking the x button on top right, we reset all states and redirect them to another page if it isn't a bad request
        dispatch(setShow(false))
        dispatch(setQualified(false))
        !badRequest && window.location.replace('https://www.crowdstreet.com/')
        dispatch(setBadRequest(false))
        setSubmitted(false)
      }}
      backdrop={badRequest ? true : 'static'} //we only want to allow users to be able to go back and modify their application in case they sent the wrong investment amount
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
          {badRequest ? (
            <p>
              Please revisit your investment application form and correct the
              investment amount.
            </p>
          ) : qualified ? (
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
                        type='password'
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
                        type='password'
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
          ) : (
            <p>
              Your application has been denied. We apologize for any
              inconvenience. Please contact customer service at 515-850-2047 or
              by email at Mustafa_Abusharkh@protonmail.com. Thank you.
            </p>
          )}
        </Modal.Body>
      )}
    </Modal>
  )
}

export default InvestmentFormResponse
