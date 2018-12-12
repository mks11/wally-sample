import React, { Component } from 'react';
import {Modal} from "react-bootstrap";
import { connect, logModalView, logEvent } from '../utils'
// import { Link } from 'react-router-dom'
// import ClickOutside from 'react-click-outside'
// import CardSmall from './CardSmall';
// import {StripeProvider, Elements} from 'react-stripe-elements'
// import { STRIPE_API_KEY } from '../config'
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';
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
      logEvent({ category: "DeliveryOptions", action: "SubmitDeliveryOptions" })
      this.userStore.setDeliveryTime(this.state.selectedTime)
      this.userStore.toggleDeliveryModal(false)
      this.props.onChangeSubmit()
    }
  }

  handleCloseModal = () => {
    logEvent({ category: "DeliveryOptions", action: "CloseDeliveryOptionsWindow" })
    this.userStore.toggleDeliveryModal(false)
  }

  render() {
    let btnSubmitClass  = 'btn btn-main mt-3'
    if (this.state.selectedTime) {
      btnSubmitClass += ' active'
    }

    return (
      <Modal show={this.userStore.deliveryModal}>
        <div className="modal-header modal-header--sm modal-header--sm-nomargin">
          <div><h3>Select delivery time</h3></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.handleCloseModal()}></button>
        </div>
        <Modal.Body className="modal-body-no-footer delivery-time-modal">
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
            <div><br></br></div>
            <div className="font-italic mb-1 text-center">Order by 2:00PM for same day delivery</div>
            <button onClick={this.handleSubmit} className={btnSubmitClass}>Submit</button>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
