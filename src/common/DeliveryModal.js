import React, { Component } from 'react';
import {Modal} from "react-bootstrap";
import { connect } from '../utils'
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
import DeliveryAddressOptions from '../common/DeliveryAddressOptions.js';

class DeliveryModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deliveryTimes: [],
      confirmHome: false,
      isAddressSelected: false,
      selectedAddress: null,
      selectedTime: null,
    }

    this.userStore = this.props.store.user
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.zipStore = this.props.store.zip
  }

  componentDidMount() {
    let preferred_address = null
    if (this.userStore.user) {
      preferred_address = this.userStore.user.preferred_address
    }
    const fakeUser = this.userStore.loadFakeUser()

    this.setState({selectedAddress: preferred_address, fakeUser})
  }

  handleUnlockAddress = async (data) => {
    this.setState({isAddressSelected: false})
  }

  handleAddNewAddress = async (data) => {
    const { newContactName, newState, newDeliveryNotes, newZip, newAptNo, newCity, newCountry, newPhoneNumber, newStreetAddress, newPreferedAddress } = data

    const dataMap = {
      name: newContactName, 
      state: newState,
      delivery_notes: newDeliveryNotes,
      zip: newZip, unit: newAptNo, city: newCity, country: newCountry, telephone: newPhoneNumber,street_address: newStreetAddress,
      preferred_address: newPreferedAddress
    }

    if (!this.userStore.user) {
      if (!this.zipStore.validateZipCode(newZip)) {
        throw {response: {data: {error:{message: 'Invalid zip code'}}}}
      }

      this.userStore.addFakeAddress(dataMap)
      this.handleSubmitAddress(dataMap)
      const fakeUser =  this.userStore.loadFakeUser()
      this.setState({fakeUser})

      return fakeUser
    }

    const response = await this.userStore.saveAddress(dataMap)
    const address = this.userStore.selectedDeliveryAddress
    this.handleSubmitAddress(address)
    return response
  }


  handleSubmitAddress = async (address) => {
    const data = await this.checkoutStore.getDeliveryTimes({
      street_address: address.street_address,
      zip: address.zip,
    }, this.userStore.getHeaderAuth())
      
    const deliveryTimes = this.checkoutStore.transformDeliveryTimes(data)
    this.setState({isAddressSelected: true, selectedAddress: address, deliveryTimes})
    return data 
  }

  handleSelectTime = (data) => {
    this.setState({selectedTime: data})
  }

  handleSubmit = (data) => {
    if (this.state.selectedAddress && this.state.selectedTime) {
      this.userStore.setDeliveryAddress(this.state.selectedAddress)
      this.userStore.setDeliveryTime(this.state.selectedTime)
      this.userStore.toggleDeliveryModal(false)
      this.props.onChangeSubmit()
    }
  }



  render() {
    let btnSubmitClass  = 'btn btn-main mt-3'
    if (this.state.selectedAddress && this.state.selectedTime) {
      btnSubmitClass += ' active'
    }

    const user = this.userStore.user ? this.userStore.user : this.state.fakeUser

    return (
      <Modal show={this.userStore.deliveryModal}>
        <div className="modal-header modal-header--sm modal-header--sm-nomargin">
          <div><h3>Select delivery time &amp; location</h3></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.toggleDeliveryModal(false)}></button>
        </div>
        <Modal.Body className="modal-body-no-footer">
          <div className="checkout-wrap">
            <div className="">
              <div >
                  <DeliveryAddressOptions
                    lock={false}
                    selected={this.userStore.selectedDeliveryAddress ? this.userStore.selectedDeliveryAddress.address_id : null}
                    user={user}
                    locking={true}
                    button={!this.state.isAddressSelected}
                    onUnlock={this.handleUnlockAddress}
                    onAddNew={this.handleAddNewAddress}
                    onSubmit={this.handleSubmitAddress}
                  />
                    <DeliveryTimeOptions
                      lock={false}
                      data={this.state.deliveryTimes}
                      selected={this.userStore.selectedDeliveryTime}
                      isAddressSelected={this.state.isAddressSelected}
                      onSelectTime={this.handleSelectTime}
                    />
              </div>
            <button onClick={this.handleSubmit} className={btnSubmitClass}>Submit</button>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
