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
      isAddressSelected: false
    }

    this.userStore = this.props.store.user
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
  }

  componentDidMount() {
    this.setState({selectedAddress: this.userStore.user.preferred_address})
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
    console.log(deliveryTimes)

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
      
    this.setState({isAddressSelected: true})
    this.userStore.setDeliveryAddress(address)
    this.getDeliveryTimes(data)
    return data 
  }

  handleSelectTime = (data) => {
    this.userStore.setDeliveryTime(data)
  }

  render() {
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
                      selectedDate={this.userStore.selectedDeliveryTime ? this.userStore.selectedDeliveryTime.date : null}
                      selectedTime={this.userStore.selectedDeliveryTime ? this.userStore.selectedDeliveryTime.time : null}
                      isAddressSelected={this.state.isAddressSelected}
                      onSelectTime={this.handleSelectTime}
                    />
                }
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
