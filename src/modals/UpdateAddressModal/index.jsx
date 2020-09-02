import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import UpdateAddressForm from './UpdateAddressForm';
import { connect } from 'utils';
import { Box } from '@material-ui/core';

function UpdateModal({ store: { user: userStore } }) {
  return (
    <Modal
      isOpen={userStore.addressModal}
      className="modal-outline"
      onClosed={(e) => userStore.closeAddressModal()}
    >
      <div className="modal-header">
        <h2> Edit Address </h2>
        <button
          className="btn-icon btn-icon--close"
          onClick={(e) => userStore.hideAddressModal()}
        ></button>
      </div>
      <Box padding={2}>
        <UpdateAddressForm userStore={userStore} />
      </Box>
    </Modal>
  );
}

class _Modal extends React.Component {
  render() {
    return <UpdateModal {...this.props} />;
  }
}

export default connect('store')(_Modal);
