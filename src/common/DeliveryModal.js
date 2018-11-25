import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../utils'
import DeliveryTimeOptions from '../common/DeliveryTimeOptions.js';

class DeliveryModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deliveryTimes: [],
      selectedAddress: null,
      selectedTime: null,
    }

    this.userStore = this.props.store.user
  }

  componentDidMount() {
    let preferred_address = null
    if (this.userStore.user) {
      preferred_address = this.userStore.user.preferred_address
    }
    // const fakeUser = this.userStore.loadFakeUser()

    this.setState({selectedAddress: preferred_address || this.userStore.selectedDeliveryAddress})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.deliveryTimes !== this.props.deliveryTimes) {
      this.setState({deliveryTimes: this.props.deliveryTimes})
    }
    if (this.userStore.deliveryModal && !prevState.selectedAddress && this.userStore.selectedDeliveryAddress) {
      this.setState({selectedAddress: this.userStore.selectedDeliveryAddress})
    }
  }

  handleSelectTime = (data) => {
    this.setState({selectedTime: data})
  }

  handleSubmit = (data) => {
    if (/*this.state.selectedAddress && */this.state.selectedTime) {
      // this.userStore.setDeliveryAddress(this.state.selectedAddress)
      this.userStore.setDeliveryTime(this.state.selectedTime)
      this.userStore.toggleDeliveryModal(false)
      this.props.onChangeSubmit()
    }
  }

  render() {
    let btnSubmitClass  = 'btn btn-main mt-3'
    if (this.state.selectedTime) {
      btnSubmitClass += ' active'
    }

    return (
      <Modal isOpen={this.userStore.deliveryModal}>
        <div className="modal-header modal-header--sm modal-header--sm-nomargin">
          <div><h3>Select delivery time</h3></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.toggleDeliveryModal(false)}></button>
        </div>
        <ModalBody className="modal-body-no-footer delivery-time-modal">
          <div className="checkout-wrap">
            <div className="">
              <div >
                <DeliveryTimeOptions
                  lock={false}
                  data={this.state.deliveryTimes}
                  selected={this.userStore.selectedDeliveryTime}
                  onSelectTime={this.handleSelectTime}
                />
              </div>
            <button onClick={this.handleSubmit} className={btnSubmitClass}>Submit</button>
            </div>
          </div>

        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
