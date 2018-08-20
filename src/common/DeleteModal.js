import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class InvalidZipModal extends Component {
  constructor(props) {
    super(props)
    this.checkoutStore = this.props.store.checkout
  }

  handleDelete() {
    this.checkoutStore.editCurrentCart()
    this.checkoutStore.toggleDeleteModal()
  }

   render() {
    return (
      <Modal isOpen={this.checkoutStore.deleteModal} >
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.checkoutStore.toggleDeleteModal(e)}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Are you sure you want to delete this item?
            </h3>
            <button onClick={e => this.handleDelete()}
              className="btn btn-main active mt-4">DELETE</button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InvalidZipModal);
