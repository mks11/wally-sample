import React, { Component } from "react";
import { Modal, ModalBody } from "reactstrap";
import { logEvent } from "services/google-analytics";
import { connect } from "../utils";

class DeliveryChangeModal extends Component {
  handleChangeDelivery = () => {
    const modalStore = this.props.store.modal;
    const userStore = this.props.store.user;

    if (modalStore.deliveryChangeType === "address") {
      logEvent({ category: "DeliveryOptions", action: "ConfirmAddressChange" });
      userStore.setDeliveryAddress(modalStore.deliveryChangeData.address);
    } else {
      logEvent({ category: "DeliveryOptions", action: "ConfirmTimeChange" });
      userStore.setDeliveryTime(modalStore.deliveryChangeData);
    }
    modalStore.hideDeliveryChange();
    this.props.onChangeSubmit && this.props.onChangeSubmit();
  };

  render() {
    const modalStore = this.props.store.modal;
    return (
      <Modal isOpen={modalStore.deliveryChange}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button
            className="btn-icon btn-icon--close"
            onClick={(e) => modalStore.hideDeliveryChange(e)}
          ></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{ lineHeight: "40px" }}>
              Delivery change
            </h3>
            <p>
              Are you sure you want to change? Product selection varies on a
              daily basis, so your cart might have to be adjusted.
            </p>
            <button
              onClick={this.handleChangeDelivery}
              className="btn btn-main active"
            >
              Submit
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryChangeModal);
