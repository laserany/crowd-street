import React from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../slices/ShowSlice'
import { Formik } from 'formik'
import * as Yup from 'yup'

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
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Password does not match'
  ),
})

const InvestmentFormResponse = () => {
  const qualified = useSelector((state) => state.qualified)
  const badRequest = useSelector((state) => state.badRequest)
  const show = useSelector((state) => state.show)
  const dispatch = useDispatch()
  return (
    <Modal
      show={show}
      onHide={() => {
        if (!qualified) {
          window.open('about:blank', '_self')
          window.close()
        } else dispatch(setShow(false))
      }}
      backdrop={!badRequest && 'static'}
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
      <Modal.Body>
        <h4>
          {badRequest
            ? 'Investment Amount is too big'
            : qualified
            ? 'Congratulations!'
            : 'Sorry'}
        </h4>
        {!qualified ? (
          <Formik
            validationSchema={schema}
            onSubmit={(values) => console.log(values)}
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
                    <Form.Control
                      name='userName'
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.userName && !errors.userName}
                      isInvalid={touched.userName && !!errors.userName}
                      placeholder='User Name'
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid'>
                      {errors.userName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='formHorizontalPassword'>
                  <Col>
                    <Form.Control
                      name='password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                      placeholder='Password'
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid'>
                      {errors.password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='formHorizontalConfirmPassword'>
                  <Col>
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
                      placeholder='Confirm Password'
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
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => dispatch(setShow(false))}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InvestmentFormResponse
