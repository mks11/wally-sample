import React, { Component } from 'react';
import ReactGA from 'react-ga';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Input } from 'reactstrap'
import Title from '../common/page/Title'
import FontAwesome from 'react-fontawesome';
import ProductModal from '../common/ProductModal';
import CardSmall from '../common/CardSmall';
import ClickOutside from 'react-click-outside'
import {StripeProvider, Elements} from 'react-stripe-elements'

import { connect, formatMoney } from '../utils'
import { STRIPE_API_KEY } from '../config'

import DeliveryTimeOptions from '../common/DeliveryTimeOptions.js';
import DeliveryAddressOptions from '../common/DeliveryAddressOptions.js';

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeDropdown: false,

      appliedStoreCredit: false,
      appliedStoreCreditAmount: 0,
      applicableStoreCreditAmount: 0,

      appliedPromo: false,
      appliedPromoCode: '',

      selectedAddress: null,
      selectedPayment: null,
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


      invalidText: '',
      successText: '',
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

      deliveryTimes: [],

      taxpopup: false,
      servicepopup: false,
      packagingdeposit: false,

    }

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.routing = this.props.store.routing
  }


  componentDidMount() {
    ReactGA.pageview("/checkout");
    this.userStore.getStatus(true)
      .then((status) => {
        this.loadData()
        if (this.userStore.user.addresses.length > 0) {
          const selectedAddress = this.userStore.user.addresses.find((d) => d._id === this.userStore.user.preferred_address)
          this.setState({selectedAddress: selectedAddress._id})
        }

        if (this.userStore.user.payment.length > 0) {
          const selectedPayment = this.userStore.user.payment.find((d) => d._id === this.userStore.user.preferred_payment)
          this.setState({selectedPayment: selectedPayment._id})
        }
      })
  }

  loadData() {
    let dataOrder
    const deliveryData = this.userStore.getDeliveryParams()
    this.checkoutStore.getOrderSummary(this.userStore.getHeaderAuth(), deliveryData).then((data) => {
      this.setState({applicableStoreCreditAmount: this.checkoutStore.order.applicable_store_credit,
        appliedPromo: this.checkoutStore.order.promo_amount,
        appliedPromoCode: this.checkoutStore.order.promo,
      })

      dataOrder = data
      return data
    }).then(data => {
      return this.checkoutStore.getDeliveryTimes(deliveryData)
    }).then(times => {
      this.userStore.adjustDeliveryTimes(dataOrder.delivery_date, times)
    }).catch((e) => {
      console.error(e)
    })
  }

  applyStoreCredit() {
    if (this.state.applicableStoreCreditAmount) {
      this.setState({
        appliedStoreCredit: true,
        appliedStoreCreditAmount: this.checkoutStore.order.applicable_store_credit
      })
      this.checkoutStore.order.total = this.checkoutStore.order.total - this.checkoutStore.order.applicable_store_credit
    }
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

    this.setState({
      addressError: false,
      timeDropdown: !this.state.timeDropdown
    })
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

  handleEdit(id, quantity) {
    this.productStore.showModal(id, quantity, this.userStore.getDeliveryParams())
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
    if (!this.userStore.selectedDeliveryAddress) {
      this.setState({invalidText: 'Please select address'})
      return
    }

    if (!this.userStore.selectedDeliveryTime) {
      this.setState({invalidText: 'Please select delivery time'})
      return
    }

    if (!this.state.confirmHome) {
      this.setState({invalidText: 'Please confirm that you are home'})
      return
    }
    if (!this.state.lockPayment) {
      this.setState({invalidText: 'Please select payment'})
      return
    }


    this.checkoutStore.createOrder({
      store_credit: this.state.appliedStoreCreditAmount > 0,
      user_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      address_id: this.userStore.selectedDeliveryAddress.address_id,
      payment_id: this.state.selectedPayment,
      delivery_time: this.userStore.selectedDeliveryTime.date + ' ' + this.userStore.selectedDeliveryTime.time,
    }, this.userStore.getHeaderAuth()).then((data) => {
      ReactGA.event({
        category: 'Order',
        action: 'Submit Order'
      });
      this.routing.push('/orders/' + data.order._id)
      this.checkoutStore.clearCart(this.userStore.getHeaderAuth())
    }).catch((e) => {
      console.error('Failed to submit order', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })
  }

  handleCheckPromo() {
    const subTotal = this.checkoutStore.order.subtotal
    const promoCode = this.state.appliedPromoCode

    if (!promoCode) {
      this.setState({invalidText: 'Promo code empty'})
      return
    }

    this.checkoutStore.checkPromo({
      subTotal,
      promoCode
    }, this.userStore.getHeaderAuth()).then((data) => {
      if (data.valid) {
        this.setState({appliedPromo: true, appliedPromoCode: promoCode, successText: 'Promo applied successfully'})
        this.userStore.getUser().then(() => {
          this.loadData()
        })
      } else {
        this.setState({invalidText: 'Invalid promo code'})
      }
    }).catch((e) => {
      if (!e.response.data.error) {
        this.setState({invalidText: 'Check promo failed'})
        return
      }
      console.error('Failed to check promo', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })

  }

  handleChangeTime(day, time, date, availability) {
    if (availability) {
      return
    }
    this.setState({selectedDay: day, selectedDate: date, selectedTime: time, lockTime: true, timeDropdown: false})
  }

  handleAddPayment = (data) => {
    return this.userStore.savePayment(data).then((data) => {
      this.userStore.setUserData(data)
      this.setState({selectedPayment: this.userStore.user.preferred_payment, newPayment: false})

      return data
    })
  }


  handleConfirmAddress(e) {
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

  showServicePopup() {
    this.setState({servicepopup: true})
  }

  hideServicePopup() {
    this.setState({servicepopup: false})
  }
  showTaxPopup() {
    this.setState({taxpopup: true})
  }


  hideTaxPopup() {
    this.setState({taxpopup: false})
  }

  showPackagingPopup() {
    this.setState({packagingdeposit: true})
  }

  hidePackagingPopup() {
    this.setState({packagingdeposit: false})
  }

  render() {
    if (!this.checkoutStore.order || !this.userStore.user) {
      return null
    }

    const order = this.checkoutStore.order

    // let timeDropdownClass = "dropdown-menu"
    // if (this.state.timeDropdown && this.state.lockAddress) {
    //   timeDropdownClass += " show"
    // }

    // const appliedStoreCreditAmount = this.state.appliedStoreCreditAmount ? this.state.appliedStoreCreditAmount/100 : 0
    const applicableStoreCreditAmount = this.state.applicableStoreCreditAmount ? this.state.applicableStoreCreditAmount/100 : 0

    // const selectedAddress = this.state.selectedAddress ? this.state.selectedAddress : this.userStore.user.preferred_address
    const selectedPayment = this.state.selectedPayment ? this.state.selectedPayment : this.userStore.user.preferred_payment

    // let addressFormClass = 'addAdressForm mb-4'
    // if (!this.state.newAddress) {
    //   addressFormClass += ' d-none'
    // }

    let paymentFormClass = 'addPaymentForm'
    if (!this.state.newPayment) {
      paymentFormClass += ' d-none'
    }

    let buttonPlaceOrderClass = 'btn btn-main'
    if (this.userStore.selectedDeliveryAddress && this.state.lockPayment && this.userStore.selectedDeliveryTime && this.state.confirmHome) {
      buttonPlaceOrderClass += ' active' 
    }

    // let addressCardClass = 'card1'
    // if (this.state.addressError) {
    //   addressCardClass += ' error'
    // }

    const cart_items = order && order.cart_items ? order.cart_items : []

    let taxpopupClass = 'summary'
    if (this.state.taxpopup) {
      taxpopupClass += ' open'
    }

    let servicepopupClass = 'summary'
    if (this.state.servicepopup) {
      servicepopupClass += ' open'
    }


    let packagingdepositClass = 'summary'
    if (this.state.packagingdeposit) {
      packagingdepositClass += ' open'
    }



    return (
      <div className="App">
        <Title content="Checkout" />
        <div className="container">

          <div className="checkout-wrap">
            <div className="">
              <div style={{maxWidth: '440px'}}>
                {this.userStore.user && 
                  <DeliveryAddressOptions
                    editable={false}
                    lock={true}
                    selected={this.userStore.selectedDeliveryAddress ? this.userStore.selectedDeliveryAddress.address_id : null}
                    user={this.userStore.user}
                  />
                }
                {this.userStore.user && 
                    <DeliveryTimeOptions
                      editable={false}
                      lock={true}
                      data={[]}
                      selected={this.userStore.selectedDeliveryTime}
                      dropdown={false}
                      isAddressSelected={true}
                    />
                }
                <div className="custom-control custom-checkbox mt-2 mb-3">
                  <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.state.confirmHome} onChange={e=>this.setState({confirmHome: !this.state.confirmHome})} />
                  <label className="custom-control-label" onClick={e=>this.setState({confirmHome: !this.state.confirmHome})}>I confirm that I will be at home or have a doorman</label>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Payment 
                  { this.state.lockPayment ? <a onClick={e => this.setState({lockPayment: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
                </h3>

                <div className="card1">
                  <div className={"card-body" + (this.state.lockPayment ? " lock" : "")}>
                    { this.userStore.user.payment.map((data, index) => {

                      if (this.state.lockPayment && selectedPayment !== data._id) {
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
                            onChange={e => this.handleSelectPayment(data._id)}
                          />
                          <label className="custom-control-label" htmlFor={"payment"+index} onClick={e=>this.handleSelectPayment(data._id)}>
                            <img src="images/card.png" alt="" /> *****{data.last4}
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
                            onChange={e=>this.handleSelectPayment(selectedPayment)}/>
                          <label className="custom-control-label" htmlFor="paymentAdd" onClick={e=>this.handleSelectPayment('0')} >Add new card</label>
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
          <div className="">
            <section className="order-summary mb-5" style={{maxWidth: '440px'}}>
              <div className="card1 card-shadow">
                <div className="card-body">
                  <h3 className="m-0 mb-2">Order Summary</h3>
                  <hr/>
                  { cart_items.map((c, i) => (

                    <div className="item mt-3 pb-2" key={i}>
                      <div className="item-left">
                        <h4 className="item-name">{c.product_name}</h4>
                        <span className="item-detail mt-2 mb-1">{c.packaging_name}</span>
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
                      <span>{formatMoney(order.subtotal/100)}</span>
                    </div>
                    <div className={taxpopupClass}>
                      <span onClick={e=>this.showTaxPopup()}>Tax</span>
                      <span>{formatMoney((order.tax_amount)/100)}</span>
                    </div>
                    <div className={servicepopupClass}>
                      <ClickOutside onClickOutside={e=>this.hideServicePopup()}>
                        <div className="popover bs-popover-right" role="tooltip" id="popover209736" x-placement="right"><div className="arrow"></div><h3 className="popover-header"></h3><div className="popover-body">
                            <Link className="text-violet" to={"/help/topics/5b919926d94b070836bd5e4b"}>Learn more</Link>
                        </div></div>
                      </ClickOutside>
                      <span onClick={e=>this.showServicePopup()}>Service fee <FontAwesome name='info-circle' /></span>
                      <span>{formatMoney((order.service_amount)/100)}</span>
                    </div>
                    <div className="summary">
                      <span>Delivery fee</span>
                      <span>{formatMoney(order.delivery_amount/100)}</span>
                    </div>
                    <div className={packagingdepositClass}>
                      <ClickOutside onClickOutside={e=>this.hidePackagingPopup()}>
                        <div className="popover bs-popover-right" role="tooltip" id="popover209736" x-placement="right" style={{left: '142px'}}><div className="arrow"></div><h3 className="popover-header"></h3><div className="popover-body">
                            <Link className="text-violet" to={"/help/topics/5b9158285e3b27043b178f90"}>Learn more</Link>
                        </div></div>
                      </ClickOutside>
                      <span onClick={e=>this.showPackagingPopup()}>Packaging deposit  <FontAwesome name='info-circle' /></span>
                      <span>{formatMoney(order.packaging_deposit/100)}</span>
                    </div>

                    <div className="summary">
                      <span>Store credit</span>
                      <span>{formatMoney(order.applied_store_credit/100)}</span>
                    </div>

                    {this.state.appliedStoreCredit ?
                        <div className="summary">
                          <span>Store credit applied</span>
                          <span>{formatMoney(this.state.appliedStoreCreditAmount/100)}</span>
                        </div>
                        :null}
                        {/*
                        {this.state.appliedPromo ?
                            <div className="summary">
                              <span>Promo code applied</span>
                              <span>{this.state.appliedPromoCode}</span>
                            </div>
                            :null}
                            */}
                          </div>

                          <div className="item-extras">
                            {!this.state.appliedStoreCredit && 1==2 ? 
                                <div className="form-group">
                                  <span className="text-blue">Apply your store credit?</span>
                                  <div className="aw-input--group aw-input--group-sm">
                                    <Input
                                      className="aw-input--control aw-input--left aw-input--bordered"
                                      type="text"
                                      placeholder="Enter your store credit"
                                      readOnly={true}
                                      value={formatMoney(applicableStoreCreditAmount)}/>
                                    <button onClick={e => this.applyStoreCredit()} type="button" className="btn btn-transparent">APPLY</button>
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
                                          onChange={(e) => this.setState({invalidText: '', appliedPromoCode: e.target.value})}/>

                                        <button onClick={e => this.handleCheckPromo()} type="button" className="btn btn-transparent">APPLY</button>
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
                                  {this.state.successText ? <span className="text-success text-center d-block mt-2">{this.state.successText}</span>:null}
                                </div>
                              </div>

                              <p className="mt-3">
                                By placing your order, you agree to be bound by the Terms of Service and Privacy Policy. Your card will be temporarily authorized for an amount slightly greater than the estimated order total. Your statement will reflect the final order total after order completion. <Link to={"/help/topics/5b919926d94b070836bd5e4b"}>Learn more.</Link>
                            </p>
                            </section>
                          </div>
                        </div>
                      </div>
                      { this.productStore.open && <ProductModal/> }
                    </div>
    );
  }
}

export default connect("store")(Checkout);
