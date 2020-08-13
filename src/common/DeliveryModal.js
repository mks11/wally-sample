import React, { Component } from "react";
import { Modal, ModalBody } from "reactstrap";
import { logEvent } from "services/google-analytics";
import { connect } from "utils";
import DeliveryTimeOptions from "common/DeliveryTimeOptions";

class DeliveryModal extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.checkoutStore = props.store.checkout;
    this.modalStore = props.store.modal;

    this.state = {
      selectedTime: null,
    };
  }

  handleSubmit = () => {
    if (this.state.selectedTime) {
      logEvent({
        category: "DeliveryOptions",
        action: "SubmitDeliveryOptions",
      });
      this.userStore.setDeliveryTime(this.state.selectedTime);
      this.modalStore.toggleDelivery();
      this.props.onChangeSubmit && this.props.onChangeSubmit();
    }
  };

  handleSelectTime = (data) => {
    this.setState({ selectedTime: data });
  };

  handleCloseModal = () => {
    logEvent({
      category: "DeliveryOptions",
      action: "CloseDeliveryOptionsWindow",
    });
    this.props.toggle();
  };

  render() {
    const { selectedTime } = this.state;

    return (
      <Modal isOpen={this.modalStore.delivery}>
        <button
          className="btn-icon btn-icon--close"
          onClick={() => this.modalStore.toggleDelivery()}
        ></button>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap">
            <h3 className="m-0 mb-2">Select delivery time</h3>
            <div className="">
              <div>
                <DeliveryTimeOptions
                  lock={false}
                  data={this.checkoutStore.deliveryTimes}
                  selected={this.userStore.selectedDeliveryTime}
                  onSelectTime={this.handleSelectTime}
                />
              </div>
              <div>
                <br></br>
              </div>
              <div className="font-italic mb-1 text-center">
                Order by 2:00PM for same day delivery
              </div>
              <button
                onClick={this.handleSubmit}
                className={`btn btn-main mt-3 ${selectedTime ? "active" : ""}`}
              >
                Submit
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
