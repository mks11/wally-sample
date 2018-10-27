import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../../utils'

class PromoSuccessModal extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user

  }

  render() {
    return (
      <Modal isOpen={this.userStore.promoSuccessModal} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.togglePromoSuccessModal()}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Your promo have been successfully added.</h3>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(PromoSuccessModal);
