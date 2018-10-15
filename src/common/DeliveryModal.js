import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect, formatMoney } from '../utils'
import { Link } from 'react-router-dom'
import ClickOutside from 'react-click-outside'
import CardSmall from './CardSmall';
import {StripeProvider, Elements} from 'react-stripe-elements'
import { STRIPE_API_KEY } from '../config'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import moment from 'moment'
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
  }

  componentDidMount() {
    let preferred_address = null
    if (this.userStore.user) {
      preferred_address = this.userStore.user.preferred_address
    }
    this.setState({selectedAddress: preferred_address})
  }

  handleUnlockAddress = async (data) => {
    this.setState({isAddressSelected: false})
  }

  handleAddNewAddress = async (data) => {
    const { newContactName, newState, newDeliveryNotes, newZip, newAptNo, newCity, newCountry, newPhoneNumber, newStreetAddress, newPreferedAddress } = data

    const response = await this.userStore.saveAddress({
      name: newContactName, 
      state: newState,
      delivery_notes: newDeliveryNotes,
      zip: newZip, unit: newAptNo, city: newCity, country: newCountry, telephone: newPhoneNumber,street_address: newStreetAddress,
      preferred_address: newPreferedAddress
    })
    this.userStore.setUserData(response)
    return response

  }

  getDeliveryTimes(data) {
    let deliveryTimes = []
    const times = data.delivery_windows
    for (var i = 0, len = times.length; i < len; i++) {
      addTimes(times[i])
    }

    this.setState({deliveryTimes})

    function addTimes(data) {
      const timeFirst = data[0].split('-')[0]
      const day = moment(data[1] + ' ' + timeFirst).calendar(null,{
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
      })

      const findTime = deliveryTimes.findIndex((data) => data.day === day)

      const obj = {
        time: data[0],
        date: data[1],
        availability: data[2]
      }

      if (findTime === -1) {
        deliveryTimes.push({day: day, data: [obj]})
      } else {
        deliveryTimes[findTime].data.push(obj)
      }
    }
  }


  handleSubmitAddress = async (address) => {
    const data = await this.checkoutStore.getDeliveryTimes({
      street_address: address.street_address,
      zip: address.zip,
    }, this.userStore.getHeaderAuth())
      
    this.setState({isAddressSelected: true, selectedAddress: address})
    this.getDeliveryTimes(data)
    return data 
  }

  handleSelectTime = (data) => {
    this.setState({selectedTime: data})
  }

  handleSubmit = (data) => {
    this.userStore.setDeliveryAddress(this.state.selectedAddress)
    this.userStore.setDeliveryTime(this.state.selectedTime)
    this.userStore.toggleDeliveryModal(false)
  }



  render() {
    let btnSubmitClass  = 'btn btn-main mt-3'
    if (this.state.selectedAddress && this.state.selectedTime) {
      btnSubmitClass += ' active'
    }

    return (
      <Modal isOpen={this.userStore.deliveryModal}>
        <div className="modal-header modal-header--sm">
          <div><h3>Select delivery time &amp; location</h3></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.toggleDeliveryModal(false)}></button>
        </div>
        <ModalBody>
          <div className="checkout-wrap">
            <div className="">
              <div >
                {this.userStore.user && 
                  <DeliveryAddressOptions
                    lock={false}
                    selected={this.userStore.selectedDeliveryAddress ? this.userStore.selectedDeliveryAddress.address_id : null}
                    user={this.userStore.user}
                    onUnlock={this.handleUnlockAddress}
                    onAddNew={this.handleAddNewAddress}
                    onSubmit={this.handleSubmitAddress}
                  />
                }
                {this.userStore.user && 
                    <DeliveryTimeOptions
                      lock={false}
                      data={this.state.deliveryTimes}
                      selected={this.userStore.selectedDeliveryTime}
                      isAddressSelected={this.state.isAddressSelected}
                      onSelectTime={this.handleSelectTime}
                    />
                }
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
