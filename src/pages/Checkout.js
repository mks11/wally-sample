import React, { Component } from 'react';
import { Input, Button } from 'reactstrap'
import Title from '../common/page/Title'
import AddressModal from './account/AddressModal'
import PaymentModal from './account/PaymentModal'
import FontAwesome from 'react-fontawesome';
import ProductModal from '../common/ProductModal';

import { connect, formatMoney } from '../utils'

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

  handleSelectAddress(id) {
    const selectedAddress = this.userStore.user.addresses[id] 
    this.setState({selectedAddress})
    if (id === "0") {
      this.setState({newAddress: true})
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
    this.checkoutStore.getDeliveryTimes({
      street_address: '',
      zip: 0,
    }, this.userStore.getHeaderAuth())
    this.setState({lockAddress: true, addressError: false})
  }

  handleSubmitPayment() {
    this.setState({lockPayment: true})
  }

  handleEdit(id) {
    this.productStore.showModal(id)
  }

  handleDelete(id) {
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

    let paymentFormClass = 'addPaymentForm mb-4'
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
                        onChange={e=>this.handleSelectAddress(index)} />
                      <label className="custom-control-label" htmlFor={"address" + index}>
                        {data.street_address} {data.unit}, {data.state} {data.zip}
                        <div className="address-phone">{this.userStore.user.name}, {this.userStore.user.telephone}</div>
                      </label>
                      {this.userStore.user.preferred_address === data.address_id ? 
                          <a className="address-rbtn link-blue">DEFAULT</a>
                          :null}
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
                      <div className="form-group">
                        <input type="text" className="form-control input1" placeholder="Address" />
                      </div>
                      <div className="row no-gutters">
                        <div className="col-md-7">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Apt number" />
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Zip code" />
                          </div>
                        </div>
                      </div>
                      <div className="row no-gutters">
                        <div className="col-md-7">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Contact Name" />
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Phone Number" />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <textarea className="form-control input2" rows="3" placeholder="Add delivery instructions"></textarea>
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
                    {!this.state.lockAddress ? <button className="btn btn-main active" onClick={e => this.handleSubmitAddress(e)}>SUBMIT</button>:null}
                  </div>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Time 
                  {this.state.lockTime ?  <a onClick={e => this.setState({lockTime: false, timeDropdown: true})} className="address-rbtn link-blue">CHANGE</a> : null}
                  {this.state.addressError ?  <span className="address-rbtn text-error sm">Address required</span> : null}
                </h3>
                <div className="dropdown show">
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

                      if (this.state.lockPayment && selectedPayment!=data.payment_id) {
                        return null
                      }
                      return (
                        <div 
                          className={"custom-control custom-radio bb1" + (data.payment_id === selectedPayment ? " active" : "")}
                          key={index}>
                          <input type="radio" id={"payment"+index}
                            value={data.payment_id} 
                            checked={data.payment_id === selectedPayment}
                            name="customRadio" className="custom-control-input"
                            onChange={e => this.handleSelectPayment(e)}
                          />
                          <label className="custom-control-label" htmlFor={"payment"+index}>
                            <img src="images/card.png" /> {data.cardnumber}
                          </label>
                          {this.userStore.user.preferred_payment === data.payment_id ? 
                              <a href="#" className="address-rbtn link-blue">DEFAULT</a>
                              :null}
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
                    </div>
                  </div>):null}
                    { !this.state.lockPayment ? <button className="btn btn-main active" onClick={e => this.handleSubmitPayment(e)}>SUBMIT</button>:null}
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
                          <a onClick={e=>this.handleEdit(c.product_id)} className="text-blue mr-2">EDIT</a>
                          <a onClick={e=>this.handleDelete(c.product_id)} className="text-dark-grey">DELETE</a>
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
                          value={appliedStoreCreditAmount}
                          onChange={(e) => this.setState({appliedStoreCreditAmount: e.target.value})}/>
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

        </div>
        { this.productStore.open ? <ProductModal/> : null}
      </div>
    );
  }
}

export default connect("store")(Checkout);
