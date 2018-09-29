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

class DeliveryModal extends Component {
  constructor(props) {
    super(props)

  this.state = {
      deliveryTimes: [],

      invalidSelectAddress: '',

      invalidAddressText: '',
      newStreetAddress: '',
      newAptNo: '',
      newZip: '',
      newContactName: '',
      newPhoneNumber: '',
      newDeliveryNotes:'',
      newState:'',
      newCity: '',
      newCountry: '',
      newPreferedAddress: false,

      selectedAddress: null,
      selectedDay: null,
      selectedDate: null,
      selectedTime: null,

      lockAddress: false,
      lockPayment: false,
      lockTime: false,
      confirmHome: false,

      newAddress: false,
      newPayment: false,

      addressError: false,

  }

    this.userStore = this.props.store.user
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
  }

  handleNewAddressChange = (newStreetAddress) => {
    this.setState({ newStreetAddress });
  }

  componentDidMount() {
    this.setState({selectedAddress: this.userStore.user.preferred_address})
  }

  handleNewAddressSelect = (newStreetAddress) => {
    this.setState({ newStreetAddress })
    geocodeByAddress(newStreetAddress)
      .then(results => {
        // console.log(results[0])
        this.fillInAddress(results[0])
      })
      .catch(error => console.error('Error', error));
  }

  fillInAddress(place) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    let address = {}

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        address[addressType] = val;
      }
    }
    console.log('adddres', address)

    let city = address.locality
    if (!city && address.administrative_area_level_1) {
      city = address.administrative_area_level_1
    }
    const state = address.administrative_area_level_1
    const country = address.country
    const zip = address.postal_code

    this.setState({newCity: city, newState: state, newCountry: country, newZip: zip})
  }

  handleConfirmAddress(e) {
    console.log('cook')
    this.setState({invalidAddressText: null})
    if (!this.state.newStreetAddress) {
      this.setState({invalidAddressText: 'Street address cannot be empty'})
      return
    }

    // if (!this.state.newAptNo) {
    //   this.setState({invalidAddressText: 'Unit cannot be empty'})
    //   return
    // }

    if (!this.state.newContactName) {
      this.setState({invalidAddressText: 'Name cannot be empty'})
      return
    }

    if (!this.state.newPhoneNumber) {
      this.setState({invalidAddressText: 'Telephone cannot be empty'})
      return
    }

    // if (!this.state.delivery_notes) {
    //   this.setState({invalidText: 'Delivery notes cannot be empty'})
    //   return
    // }
    //
    const { newContactName, newState, newDeliveryNotes, newZip, newAptNo, newCity, newCountry, newPhoneNumber, newStreetAddress, newPreferedAddress } = this.state

    this.userStore.saveAddress({
      name: newContactName, 
      state: newState,
      delivery_notes: newDeliveryNotes,
      zip: newZip, unit: newAptNo, city: newCity, country: newCountry, telephone: newPhoneNumber,street_address: newStreetAddress,
      preferred_address: newPreferedAddress
    }).then((data) => {
      this.userStore.setUserData(data)
      this.setState({
        selectedAddress: this.userStore.user.preferred_address,
        newAddress: false,
        invalidAddressText: '',
        newStreetAddress: '',
        newAptNo: '',
        newZip: '',
        newContactName: '',
        newPhoneNumber: '',
        newDeliveryNotes:'',
        newState:'',
        newCity: '',
        newCountry: '',
        newPreferedAddress: false
      })
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidAddressText: msg})
      console.error('Failed to save address', e)
    })

    e.preventDefault()
  }

  handleSubmitAddress() {
    if (!this.state.selectedAddress) return
    this.setState({invalidSelectAddress: null})
    const address = this.userStore.user.addresses.find((d) => d._id === this.state.selectedAddress)
    let deliveryTimes = []
    this.checkoutStore.getDeliveryTimes({
      street_address: address.street_address,
      zip: address.zip,
    }, this.userStore.getHeaderAuth()).then((data) => {
      const times = data.delivery_windows
      for (var i = 0, len = times.length; i < len; i++) {
        addTimes(times[i])
      }

      this.setState({deliveryTimes, lockAddress: true, addressError: false})
    }).catch((e) => {
      console.log(e.response)
      if (e.response.data.error) {
        this.setState({invalidSelectAddress: e.response.data.error.message})
      }
      console.error(e)
    })

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

  handleSubmitPayment() {
    if (!this.state.selectedPayment) return
    this.setState({lockPayment: true})
  }

  toggleTimeDropdown(e) {
    if (!this.state.lockAddress) {
      this.setState({addressError: true})
      return
    }

    this.setState({addressError: false})
    this.setState({timeDropdown: !this.state.timeDropdown})
  }

  hideTimeDropdown(e) {
    if (!this.state.timeDropdown) {
      return
    }

    this.setState({timeDropdown: false})
  }

  handleSelectAddress(address_id) {
    this.setState({selectedAddress: address_id})
    if (address_id === '0') {
      this.setState({newAddress: true, newContactName: this.userStore.user.name, newPhoneNumber: this.userStore.user.primary_telephone})
    } else {
      this.setState({newAddress: false})
    }
  }

  handleSelectPayment(payment_id) {
    this.setState({selectedPayment: payment_id})
    if (payment_id === "0") {
      this.setState({newPayment: true})
    } else {
      this.setState({newPayment: false})
    }
  }

  handleChangeTime(day, time, date, availability) {
    if (availability) {
      return
    }
    this.setState({selectedDay: day, selectedDate: date, selectedTime: time, lockTime: true, timeDropdown: false})
  }

  handleConfirmDelivery() {
    const {selectedAddress, selectedDate, selectedTime, selectedDay} = this.state
    if (selectedAddress && selectedDate) {
      const address = this.userStore.user.addresses.find((d) => d._id === selectedAddress)
      this.userStore.setDeliveryZip(address)
      this.userStore.setDeliveryTime({selectedDate, selectedDay, selectedTime})
      this.userStore.toggleDeliveryModal(false)
      this.productStore.showModal(this.productStore.activeProductId)
    }
  }

   render() {

    const selectedAddress = this.state.selectedAddress ? this.state.selectedAddress : this.userStore.user.preferred_address
    const selectedPayment = this.state.selectedPayment ? this.state.selectedPayment : this.userStore.user.preferred_payment

    let timeDropdownClass = "dropdown-menu"
    if (this.state.timeDropdown && this.state.lockAddress) {
      timeDropdownClass += " show"
    }

    let addressFormClass = 'addAdressForm mb-4'
    if (!this.state.newAddress) {
      addressFormClass += ' d-none'
    }

    let paymentFormClass = 'addPaymentForm'
    if (!this.state.newPayment) {
      paymentFormClass += ' d-none'
    }

    let addressCardClass = 'card1'
    if (this.state.addressError) {
      addressCardClass += ' error'
    }

    let buttonConfirmDeliveryClass = 'btn btn-main w-100'
    if (this.state.selectedAddress && this.state.selectedDate) {
      buttonConfirmDeliveryClass += ' active'
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
              <div style={{maxWidth: '440px'}}>
                <h3 className="m-0 mb-3 p-r">
                  Delivery address
                  { this.state.lockAddress ? <a onClick={e => this.setState({lockAddress: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
                </h3>
                <div className={addressCardClass}>
                  <div className={"card-body" + (this.state.lockAddress ? " lock" : "")}>
                    { this.userStore.user.addresses.map((data, index) => {
                      if (this.state.lockAddress && selectedAddress!=data.address_id) {
                        return null
                      }
                      return (
                        <div 
                          className={"custom-control custom-radio bb1" + (data.address_id === selectedAddress ? " active" : "")}
                          key={index}>
                          <input 
                            type="radio" id={"address-" + index} 
                            name="customRadio" 
                            checked={data.address_id === selectedAddress}
                            className="custom-control-input" 
                            value={data.address_id} 
                            onChange={e=>this.handleSelectAddress(data.address_id)} />
                          <label className="custom-control-label" htmlFor={"address-" + index} onClick={e=>this.handleSelectAddress(data.address_id)}>
                            {data.street_address} {data.unit}, {data.state} {data.zip}
                            <div className="address-phone">{data.name}, {data.telephone}</div>
                          </label>
                          {this.userStore.user.preferred_address === data.address_id &&
                              <a className="address-rbtn link-blue">DEFAULT</a>
                          }
                        </div>)
                    })}

                    { !this.state.lockAddress ?  (
                      <div>
                        <div 
                          className={"custom-control custom-radio bb1" + ("0" === selectedAddress ? " active" : "")}
                        >
                          <input type="radio" id="addressAdd" name="customRadio" className="custom-control-input" 
                            value="0" 
                            checked={selectedAddress === "0"}
                            onChange={e=>this.handleSelectAddress('0')}/>
                          <label className="custom-control-label" htmlFor="addressAdd" onClick={e=>this.handleSelectAddress('0')}>Add new address</label>
                        </div>
                        <div className={addressFormClass}>
                          <PlacesAutocomplete
                            value={this.state.newStreetAddress}
                            onChange={this.handleNewAddressChange}
                            onSelect={this.handleNewAddressSelect}
                          >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                              <div style={{position:'relative'}}>
                                <input
                                  {...getInputProps({
                                    autoComplete: 'off',
                                    placeholder: 'Delivery to...',
                                    className: 'aw-input--control aw-input--small  aw-input--left location-search-input  aw-input--location mt-3 form-control',
                                  })}
                                />
                                <div className={"autocomplete-dropdown-container" + (suggestions.length > 0 ? '' : ' d-none') }>
                                  {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <strong>
                                          {suggestion.formattedSuggestion.mainText}
                                        </strong>{' '}
                                        <small>
                                          {suggestion.formattedSuggestion.secondaryText}
                                        </small>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </PlacesAutocomplete>
                          <div className="row mt-3">
                            <div className="col-md-7">
                              <div className="form-group">
                                <input 
                                  value={this.state.newAptNo}
                                  onChange={e=>this.setState({newAptNo: e.target.value})}
                                  type="text" className="form-control input1" placeholder="Apt number" />
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="form-group">
                                <input 
                                  value={this.state.newZip}
                                  onChange={e=>this.setState({newZip: e.target.value})}
                                  type="text" className="form-control input1" placeholder="Zip code" />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-7">
                              <div className="form-group">
                                <input
                                  value={this.state.newContactName}
                                  onChange={e=>this.setState({newContactName: e.target.value})}
                                  type="text" className="form-control input1" placeholder="Contact Name" />
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="form-group">
                                <input
                                  value={this.state.newPhoneNumber}
                                  onChange={e=>this.setState({newPhoneNumber: e.target.value})}
                                  type="text" className="form-control input1" placeholder="Phone Number" />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <textarea
                              value={this.state.newDeliveryNotes}
                              onChange={e=>this.setState({newDeliveryNotes: e.target.value})}
                              className="form-control input2" rows="3" placeholder="Add delivery instructions"></textarea>
                          </div>
                          <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" onChange={e=>this.setState({newPreferedAddress: !this.state.newPreferedAddress})} />
                            <label className="custom-control-label" htmlFor="customCheck1">Make default address</label>
                          </div>
                          <hr />
                          <button className="btn btn-main active inline-round" onClick={e=>this.handleConfirmAddress(e)}>CONFIRM</button>
                          {this.state.invalidAddressText && <div className="error-msg">{this.state.invalidAddressText}</div>}
                        </div>
                      </div>
                    ):null}
                    {(!this.state.lockAddress && !this.state.newAddress) ? <button className="btn btn-main active" onClick={e => this.handleSubmitAddress(e)}>SUBMIT</button>:null}

                    {this.state.invalidSelectAddress && <span className="text-error text-center d-block mt-3">{this.state.invalidSelectAddress}</span>}
                  </div>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Time 
                  {this.state.lockTime ?  <a onClick={e => this.setState({lockTime: false, timeDropdown: true})} className="address-rbtn link-blue">CHANGE</a> : null}
                  {this.state.addressError ?  <span className="address-rbtn text-error sm">Address required</span> : null}
                </h3>
                <div className="dropdown show">
                  <ClickOutside onClickOutside={e=>this.hideTimeDropdown()}>
                    <button onClick={e=>this.toggleTimeDropdown()} className="btn btn-dropdown-outline dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">
                      {this.state.selectedTime ? <React.Fragment>{this.state.selectedDay}, {this.state.selectedTime}</React.Fragment> : 'Choose delivery date and time'}
                    </button>
                    <div className={timeDropdownClass}>
                      {this.state.deliveryTimes.map((items, key) => (
                        <React.Fragment key={key}>
                          <h6 className="dropdown-header">{items.day}</h6>
                          {items.data.map((item, key2) => ( 
                            <div className="dropdown-item" key={key2} onClick={e => this.handleChangeTime(items.day, item.time, item.date, item.availability)}  >
                              <div className="custom-control custom-radio">
                                <input 
                                  checked={this.state.selectedDate === item.date && this.state.selectedTime === item.time}
                                  type="radio" id={"date-time-"+ key2} name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(items.day, item.time, item.date, item.availability)} />
                                <label className="custom-control-label" >{item.time} {item.availability && <span className="text-muted">Not Available</span>}</label>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </ClickOutside>
                </div>
                <div className="custom-control custom-checkbox mt-2 mb-3">
                  <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.state.confirmHome} onChange={e=>this.setState({confirmHome: !this.state.confirmHome})} />
                  <label className="custom-control-label" onClick={e=>this.setState({confirmHome: !this.state.confirmHome})}>I confirm that I will be at home or have a doorman</label>
                </div>
            </div>
          </div>
        </div>
        <button className={buttonConfirmDeliveryClass} onClick={e=>this.handleConfirmDelivery(e)}>CONFIRM</button>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryModal);
