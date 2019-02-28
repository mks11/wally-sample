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
            <h3 className="m-0 mb-2">Packaging Add Ons</h3>
            <p className="mb-5 info-popup">
              This product has an add-on option(s): oil spout ($2.50). Add-on items are not part of our returnable program, but are intended for you to reuse. Simply swap them onto fresh jars of liquids when you order them, and only return the empty jars. So keep and reuse the packaging add-on at home, and return the jar to us - capish?
            </p>
            <button onClick={this.handleClose} className="btn btn-main active">Got it!</button>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect('store')(AddonFirstModal)
