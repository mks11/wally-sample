import React, { Component } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { connect } from 'utils'

class AddonFirstModal extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.modalStore = props.store.modal
  }

  componentDidUpdate() {
    this.modalStore.addonsFirst && this.userStore.updateFlags('addonsFirst', true)
  }

  handleClose = () => {
    this.modalStore.toggleAddonsFirst()
  }

  render() {
    return (
      <Modal isOpen={this.modalStore.addonsFirst}>
        <button className="btn-icon btn-icon--close" onClick={this.handleClose}></button>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap">
            <h3 className="m-0 mb-2">Add-ons are coming!</h3>
            <p className="mb-5 info-popup">
              The prices you pay are the exact ones we pay at the farmers markets and bulk shops, so you can be sure you’re getting the lowest price possible.
              <br/>
              <br/>
              <small>Prices on website are subject to change based on actual prices paid.</small>
            </p>
            <button onClick={this.handleClose} className="btn btn-main active">Got it!</button>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect('store')(AddonFirstModal)
