import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Modal, ModalBody}  from 'reactstrap';
import { connect } from '../utils'

class InvalidZipSuccessModal extends Component {
   render() {
    const modalStore = this.props.store.modal
    return (
      <Modal isOpen={modalStore.invalidZipSuccess} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => modalStore.toggleInvalidZipSuccess(e)}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-3 text-center" style={{lineHeight: '40px'}}>Thanks!<br/> We'll notify you when we launch in your area.<br/> Follow us on Instagram @thewallyshop and stay up to date on all things sustainability.</h3>
            <p className="text-center">
              <Link to="/main" className="btn btn-primary btn-explore" onClick={e => modalStore.toggleInvalidZipSuccess(e)}>Explore</Link>
            </p>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InvalidZipSuccessModal);
