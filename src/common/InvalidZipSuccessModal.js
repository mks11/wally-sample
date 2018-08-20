import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class InvalidZipModal extends Component {
   render() {
    const modalStore = this.props.store.modal
    return (
      <Modal isOpen={modalStore.invalidZipSuccess} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => modalStore.toggleInvalidZipSuccess(e)}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Great you'll be the first to know when we are in your zipcode!</h3>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InvalidZipModal);
