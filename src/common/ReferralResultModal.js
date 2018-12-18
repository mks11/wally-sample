import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../utils'

class ReferralResultModal extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
  }

  handleToggle = () => {
    this.modalStore.toggleResultReferral()
  }

  render() {
    const store = this.props.store
    return (
      <Modal isOpen={store.modal.resultReferral} contentClassName="modal-bg-pinneapple" toggle={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">Gift Card Referral</h3>
            <span className="mb-1">
              {store.modal.resultReferralMsg}
            </span>
          </div>

        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ReferralResultModal);
