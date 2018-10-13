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
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Thanks!<br/> We'll notify you when we launch in your area.<br/> Follow us on Instagram @thewallyshop and stay up to date on all things sustainability.</h3>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InvalidZipModal);
