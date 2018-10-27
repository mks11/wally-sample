import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../../utils'

class ReportSuccessModal extends Component {
   render() {
    const orderStore = this.props.store.order
    return (
      <Modal isOpen={orderStore.reportSuccessModal} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => orderStore.toggleReportSuccess(e)}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Your issue have been submitted.</h3>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ReportSuccessModal);
