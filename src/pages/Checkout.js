import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Input, Button } from 'reactstrap'
import Title from '../common/page/Title'
import AddressModal from './account/AddressModal'
import PaymentModal from './account/PaymentModal'
import FontAwesome from 'react-fontawesome';
import ProductModal from '../common/ProductModal';
import CardSmall from '../common/CardSmall';
import ClickOutside from 'react-click-outside'
import {StripeProvider, Elements} from 'react-stripe-elements'

import { connect, formatMoney } from '../utils'
import { STRIPE_API_KEY } from '../config'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeDropdown: false,

      appliedStoreCredit: false,
      appliedStoreCreditAmount: 0,

      appliedPromo: false,
      appliedPromoCode: '',

      selectedAddress: null,
      selectedPayment: null,
      selectedTime: null,

      lockAddress: false,
      lockPayment: false,
      lockTime: false,
      confirmHome: false,

      newAddress: false,
      newPayment: false,

      addressError: false,


      invalidText: '',

      newStreetAddress: '',
      newAptNo: '',
      newZip: '',
      newContactName: '',
      newPhoneNumber: '',
      newDeliveryNotes:''

    }

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout

  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
        if (this.userStore.user.addresses.length > 0) {
          const selectedAddress = this.userStore.user.addresses.find((d) => d._id === this.userStore.user.preferred_address)
          console.log(selectedAddress)
          this.setState({selectedAddress: selectedAddress._id})
        }

        if (this.userStore.user.payment.length > 0) {
          const selectedPayment = this.userStore.user.payment.find((d) => d._id === this.userStore.user.preferred_payment)
          this.setState({selectedPayment: selectedPayment._id})
        }
      })
  }

  loadData() {
    this.checkoutStore.getOrderSummary(this.userStore.getHeaderAuth()).then((data) => {
      console.log(data)
      console.log(this.checkoutStore.order)
    }).catch((e) => {
      console.error(e)
    })
  }

  applyStoreCredit() {
    this.setState({
      appliedStoreCredit: true,
      appliedStoreCreditAmount: this.state.appliedStoreCreditAmount ? this.state.appliedStoreCreditAmount : this.checkoutStore.order.applicable_store_credit
    })
  }

  applyPromo() {
    this.setState({
      appliedPromo: true,
    })
    this.checkoutStore.applyPromo()
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

  handleSelectAddress(e) {
    this.setState({selectedAddress: e.target.value})
    if (e.target.value === '0') {
      this.setState({newAddress: true, newContactName: this.userStore.user.name, newPhoneNumber: this.userStore.user.primary_telephone})
    } else {
      this.setState({newAddress: false})
    }
  }

  handleSelectPayment(e) {
    this.setState({selectedPayment: e.target.value})
    if (e.target.value === "0") {
      this.setState({newPayment: true})
    } else {
      this.setState({newPayment: false})
    }
  }

  handleSubmitAddress() {
    if (!this.state.selectedAddress) return
    const address = this.userStore.user.addresses.find((d) => d._id === this.state.selectedAddress)
    this.checkoutStore.getDeliveryTimes({
      street_address: address.street_address,
      zip: address.zip,
    }, this.userStore.getHeaderAuth())
    this.setState({lockAddress: true, addressError: false})
  }

  handleSubmitPayment() {
    if (!this.state.selectedPayment) return
      
    this.setState({lockPayment: true})
  }

  handleEdit(id, quantity) {
    this.productStore.showModal(id, quantity)
  }

  handleDelete(data) {
    const id = {
      product_id : data.product_id,
      inventory_id : data.inventory[0]._id
    }
    this.checkoutStore.toggleDeleteModal(id)
  }

  handlePlaceOrder() {
    this.setState({invalidText: ''})
    if (!this.state.lockAddress) {
      this.setState({invalidText: 'Please select address'})
      return
    }

    if (!this.state.lockPayment) {
      this.setState({invalidText: 'Please select payment'})
      return
    }
    
    if (!this.state.lockTime) {
      this.setState({invalidText: 'Please select delivery time'})
      return
    }

    if (!this.state.confirmHome) {
      this.setState({invalidText: 'Please confirm that you are home'})
      return
    }
  }

  handleChangeTime(e) {
    this.setState({selectedTime: 'Today, 12:30PM - 1.30PM', lockTime: true, timeDropdown: false})
  }

  handleAddPayment = (data) => {
    return this.userStore.savePayment(data).then((data) => {
      this.userStore.setUserData(data)
      this.setState({selectedPayment: this.userStore.user.preferred_payment, newPayment: false})
      
      return data
    })
  }

  handleNewAddressChange = (new_address) => {
    this.setState({ new_address });
  }

  handleNewAddressChange = (new_address) => {
    this.setState({ new_address })
    geocodeByAddress(new_address)
      .then(results => {
        console.log(results[0])
        // this.fillInAddress(results[0])
      })
      .catch(error => console.error('Error', error));
  }
  
  render() {
    if (!this.checkoutStore.order || !this.userStore.user) {
      return null
    }

    const store = this.props.store
    const order = this.checkoutStore.order

    let timeDropdownClass = "dropdown-menu"
    if (this.state.timeDropdown && this.state.lockAddress) {
      timeDropdownClass += " show"
    }
     
    const appliedStoreCreditAmount = this.state.appliedStoreCreditAmount ? this.state.appliedStoreCreditAmount : 0

    const selectedAddress = this.state.selectedAddress ? this.state.selectedAddress : this.userStore.user.preferred_address
    const selectedPayment = this.state.selectedPayment ? this.state.selectedPayment : this.userStore.user.preferred_payment
    const selectedTime = this.state.selectedTime ? this.state.selectedTime : 'Choose delivery date & time'

    let addressFormClass = 'addAdressForm mb-4'
    if (!this.state.newAddress) {
      addressFormClass += ' d-none'
    }

    let paymentFormClass = 'addPaymentForm'
    if (!this.state.newPayment) {
      paymentFormClass += ' d-none'
    }

    let buttonPlaceOrderClass = 'btn btn-main'
    if (this.state.lockAddress && this.state.lockPayment && this.state.lockTime && this.state.confirmHome) {
     buttonPlaceOrderClass += ' active' 
    }

    let addressCardClass = 'card1'
    if (this.state.addressError) {
      addressCardClass += ' error'
    }

    const cart_items = order && order.cart_items ? order.cart_items : []


    return (
      <div className="App">
        <Title content="Checkout" />
        <div className="container">

          <div className="row">
            <div className="col-md-6">
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
                          type="radio" id={"address" + index} 
                          name="customRadio" 
                          checked={data.address_id === selectedAddress}
                          className="custom-control-input" 
                        value={data.address_id} 
                        onChange={e=>this.handleSelectAddress(e)} />
                      <label className="custom-control-label" htmlFor={"address" + index}>
                        {data.street_address} {data.unit}, {data.state} {data.zip}
                        <div className="address-phone">{this.userStore.user.name}, {this.userStore.user.telephone}</div>
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
                        onChange={e=>this.handleSelectAddress(e)}/>
                      <label className="custom-control-label" htmlFor="addressAdd">Add new address</label>
                    </div>
                    <div className={addressFormClass}>
      <PlacesAutocomplete
        value={this.state.new_address}
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
            <div className="autocomplete-dropdown-container">
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
                      <div className="row no-gutters">
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
                      <div className="row no-gutters">
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
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Make default payment method</label>
                      </div>
                      <hr />
                      <button className="btn btn-main active inline-round">CONFIRM</button>
                      <div className="error-msg d-none">Zipcode not serviced</div>
                    </div>
                  </div>
                    ):null}
                    {(!this.state.lockAddress && !this.state.newAddress) ? <button className="btn btn-main active" onClick={e => this.handleSubmitAddress(e)}>SUBMIT</button>:null}
                  </div>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Time 
                  {this.state.lockTime ?  <a onClick={e => this.setState({lockTime: false, timeDropdown: true})} className="address-rbtn link-blue">CHANGE</a> : null}
                  {this.state.addressError ?  <span className="address-rbtn text-error sm">Address required</span> : null}
                </h3>
                <div className="dropdown show">
                  <ClickOutside onClickOutside={e=>this.hideTimeDropdown()}>
                  <button onClick={e=>this.toggleTimeDropdown()} className="btn btn-dropdown-outline dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">
                    {selectedTime}
                                      </button>
                  <div className={timeDropdownClass}>
                    <h6 className="dropdown-header">Today</h6>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio disabled">
                        <input type="radio" id="time1" name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(e)} />
                        <label className="custom-control-label" htmlFor="time1">12:30PM - 1:30PM <span className="text-muted">Not Available</span></label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time2" name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(e)} defaultChecked />
                        <label className="custom-control-label" htmlFor="time2">3:30PM - 4:30PM</label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time3" name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(e)} />
                        <label className="custom-control-label" htmlFor="time3">6:00PM - 7:00PM</label>
                      </div>
                    </div>
                    <h6 className="dropdown-header">Tomorrow, Jul 22, 2018</h6>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time4" name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(e)} />
                        <label className="custom-control-label" htmlFor="time4">12:30PM - 1:30PM</label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time5" name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(e)} />
                        <label className="custom-control-label" htmlFor="time5">3:30PM - 4:30PM</label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time6" name="timeRadio" className="custom-control-input"  />
                        <label className="custom-control-label" htmlFor="time6">6:00PM - 7:00PM</label>
                      </div>
                    </div>
                    <h6 className="dropdown-header">Wed, Jul 23, 2018</h6>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time7" name="timeRadio" className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="time7">12:30PM - 1:30PM</label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time8" name="timeRadio" className="custom-control-input" defaultChecked />
                        <label className="custom-control-label" htmlFor="time8">3:30PM - 4:30PM</label>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="custom-control custom-radio">
                        <input type="radio" id="time9" name="timeRadio" className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="time9">6:00PM - 7:00PM</label>
                      </div>
                    </div>
                  </div>
                </ClickOutside>
                </div>
                <div className="custom-control custom-checkbox mt-2 mb-3">
                  <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.state.confirmHome} onChange={e=>this.setState({confirmHome: !this.state.confirmHome})} />
                  <label className="custom-control-label" htmlFor="homeCheck">I confirm that I will be at home or have a doorman</label>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Payment 
                  { this.state.lockPayment ? <a onClick={e => this.setState({lockPayment: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
                </h3>

                <div className="card1">
                  <div className={"card-body" + (this.state.lockPayment ? " lock" : "")}>
                    { this.userStore.user.payment.map((data, index) => {

                      if (this.state.lockPayment && selectedPayment!=data._id) {
                        return null
                      }
                      return (
                        <div 
                          className={"custom-control custom-radio bb1" + (data._id === selectedPayment ? " active" : "")}
                          key={index}>
                          <input type="radio" id={"payment"+index}
                            value={data._id} 
                            checked={data._id === selectedPayment}
                            name="customRadio" className="custom-control-input"
                            onChange={e => this.handleSelectPayment(e)}
                          />
                          <label className="custom-control-label" htmlFor={"payment"+index}>
                            <img src="images/card.png" /> *****{data.last4}
                          </label>
                          {this.userStore.user.preferred_payment === data._id &&
                              <a href="#" className="address-rbtn link-blue" style={{top:'10px'}}>DEFAULT</a>
                          }
                        </div>
                      )
                    })}

                    { !this.state.lockPayment ?  (
                      <div>
                    <div 
                      className={"custom-control custom-radio bb1" + ("0" === selectedPayment ? " active" : "")}
                      >
                      <input type="radio" id="paymentAdd" name="customRadio" className="custom-control-input" 
                        value="0"
                        checked={selectedPayment === "0"}
                        onChange={e=>this.handleSelectPayment(e)}/>
                      <label className="custom-control-label" htmlFor="paymentAdd">Add new card</label>
                    </div>
                    <div className={paymentFormClass}>
                      {/* 
                      <div className="row no-gutters">
                        <div className="col-md-4">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Card number" />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="MM/YY" />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="CVV" />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Zipcode" />
                          </div>
                        </div>
                      </div>
                      <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Make default payment method</label>
                      </div>
                      <hr />
                      <button className="btn btn-main active inline-round">CONFIRM</button>
                      <div className="error-msg d-none">Invalid card information</div>
                      */}

                      <StripeProvider apiKey={STRIPE_API_KEY}>
                        <Elements>
                          <CardSmall  addPayment={this.handleAddPayment} />
                        </Elements>
                      </StripeProvider>
                    </div>
                  </div>):null}
                    { (!this.state.lockPayment && !this.state.newPayment) && <button className="btn btn-main active" onClick={e => this.handleSubmitPayment(e)}>SUBMIT</button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <section className="order-summary mb-5" style={{maxWidth: '440px'}}>
                <div className="card1 card-shadow">
                  <div className="card-body">
                    <h3 className="m-0 mb-2">Order Summary</h3>
                    <hr/>
                    { cart_items.map((c, i) => (

                    <div className="item mt-3 pb-2" key={i}>
                      <div className="item-left">
                        <h4 className="item-name">{c.product_name}</h4>
                        <span className="item-detail mt-2 mb-1">2 oz, container large</span>
                        <div className="item-link">
                          <a onClick={e=>this.handleEdit(c.product_id, c.customer_quantity)} className="text-blue mr-2">EDIT</a>
                          <a onClick={e=>this.handleDelete(c)} className="text-dark-grey">DELETE</a>
                        </div>
                      </div>
                      <div className="item-right">
                        <h4>x{c.customer_quantity}</h4>
                        <span className="item-price">{formatMoney(c.total/100)}</span>
                      </div>
                    </div>
                    ))}


                    <div className="item-summaries">
                      <div className="summary">
                        <span>Subtotal</span>
                        <span>{formatMoney(order.sub_total/100)}</span>
                      </div>
                      <div className="summary">
                        <span>Tax &amp; service fee <FontAwesome name='info-circle' /></span>
                        <span>{formatMoney((order.tax_amount + order.service_amount)/100)}</span>
                      </div>
                      <div className="summary">
                        <span>Delivery fee</span>
                        <span>$0</span>
                      </div>
                      <div className="summary">
                        <span>Packaging deposit  <FontAwesome name='info-circle' /></span>
                        <span>{formatMoney(order.packaging_deposit/100)}</span>
                      </div>
                      {this.state.appliedStoreCredit ?
                      <div className="summary">
                        <span>Store credit applied</span>
                        <span>{formatMoney(this.state.appliedStoreCreditAmount)}</span>
                      </div>
                          :null}
                      {this.state.appliedPromo ?
                      <div className="summary">
                        <span>Promo code applied</span>
                        <span>{this.state.appliedPromoCode}</span>
                      </div>
                          :null}
                    </div>

                    <div className="item-extras">
                      {!this.state.appliedStoreCredit ? 
                      <div className="form-group">
                        <span className="text-blue">Apply your store credit?</span>
                        <div className="aw-input--group aw-input--group-sm">
                        <Input
                          className="aw-input--control aw-input--left aw-input--bordered"
                          type="text"
                          placeholder="Enter your store credit"
                          readOnly={true}
                          value={appliedStoreCreditAmount}
                          onChange={(e) => this.setState({appliedStoreCreditAmount: e.target.value})}/>
                        {appliedStoreCreditAmount>0 && <button onClick={e => this.applyStoreCredit()} type="button" className="btn btn-transparent">APPLY</button>}
                      </div>
                      </div>
                      :null}

                      {!this.state.appliedPromo ? 
                      <div className="form-group">
                        <span className="text-blue">Have a promo code</span>
                        <div className="aw-input--group aw-input--group-sm">
                        <Input
                          className="aw-input--control aw-input--left aw-input--bordered"
                          type="text"
                          placeholder="Enter promocode here"
                          onChange={(e) => this.setState({appliedPromoCode: e.target.value})}/>

                        <button onClick={e => this.applyPromo()} type="button" className="btn btn-transparent">APPLY</button>
                        </div>
                      </div>
                          :null}
                    </div>
                    <hr className="mt-4" />
                    <div className="item-total">
                      <span>Total</span>
                      <span>{formatMoney(order.total/100)}</span>
                    </div>
                    <button onClick={e => this.handlePlaceOrder()} className={buttonPlaceOrderClass}>PLACE ORDER</button>
                    {this.state.invalidText ? <span className="text-error text-center d-block mt-2">{this.state.invalidText}</span>:null}
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">&nbsp;</div>
            <div className="col-md-6 my-3 text-left d-inline-block">
              By placing your order, you agree to be bound by the Terms of Service and Privacy Policy. Your card will be temporarily authorized for $40. Your statement will reflect the final order total after order completion. 
              <Link to={""}>Learn more.</Link>
              <br/>A bag fee may be added to your final total if required by law or the retailer. The fee will be visible on your receipt after delivery.
            </div>
          </div>
        </div>
        { this.productStore.open ? <ProductModal/> : null}
      </div>
    );
  }
}

export default connect("store")(Checkout);
