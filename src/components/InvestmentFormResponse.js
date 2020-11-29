import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../slices/ShowSlice'

const InvestmentFormResponse = () => {
  const qualified = useSelector((state) => state.qualified)
  const badRequest = useSelector((state) => state.badRequest)
  const show = useSelector((state) => state.show)
  const dispatch = useDispatch()
  return (
    <Modal
      show={show}
      onHide={() => dispatch(setShow(false))}
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
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => dispatch(setShow(false))}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InvestmentFormResponse
