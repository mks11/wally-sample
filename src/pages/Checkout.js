import React, { Component } from 'react'
import ReactGA from 'react-ga'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Input } from 'reactstrap'
import CurrencyInput from 'react-currency-input'
import Title from 'common/page/Title'
import FontAwesome from 'react-fontawesome'
import ClickOutside from 'react-click-outside'
import PaymentSelect from 'common/PaymentSelect'
import AmountGroup from 'common/AmountGroup'

import { connect, formatMoney, logEvent, logModalView, logPageView, datesEqual } from '../utils'

import DeliveryTimeOptions from 'common/DeliveryTimeOptions'
import DeliveryAddressOptions from 'common/DeliveryAddressOptions'
import DeliveryChangeModal from 'common/DeliveryChangeModal'

class Checkout extends Component {
  constructor(props) {
    super(props)

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.routing = this.props.store.routing

    this.state = {
      timeDropdown: false,

      appliedStoreCredit: false,
      appliedStoreCreditAmount: 0,
      applicableStoreCreditAmount: 0,

      appliedPromo: false,
      appliedPromoCode: '',

      appliedTipAmount: 0,
      appliedTipAmountChanged: false,
      tippingpopup: false,
      tipReadOnly: true,
      tipApplyEdited: false,
      freezedTipAmount: null,

      selectedAddress: null,
      selectedPayment: null,
      selectedDay: null,
      selectedDate: null,
      selectedTime: null,

      lockAddress: true,
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

      deliveryTimes: this.checkoutStore.deliveryTimes,

      taxpopup: false,
      servicepopup: false,
      packagingdeposit: false,
      placeOrderRequest: false,
    }
  }


  componentDidMount() {
    ReactGA.pageview("/checkout");
    this.userStore.getStatus(true)
      .then((status) => {
        if (status) {
          const selectedAddress = this.userStore.selectedDeliveryAddress || (this.userStore.user ? this.userStore.getAddressById(this.userStore.user.preferred_address) : null)
          if (selectedAddress) {
            this.userStore.setDeliveryAddress(selectedAddress)
          }

          this.checkoutStore.getDeliveryTimes()

          this.loadData()
          if (this.userStore.user.addresses.length > 0) {
            const selectedAddress = this.userStore.user.addresses.find((d) => d._id === this.userStore.user.preferred_address)
            this.setState({selectedAddress: selectedAddress._id})
          } else {
            this.setState({lockAddress: false})
          }

          if (this.userStore.user.payment.length > 0) {
            const selectedPayment = this.userStore.user.payment.find((d) => d._id === this.userStore.user.preferred_payment)
            this.setState({selectedPayment: selectedPayment._id})
          }
        } else {
          this.routing.push('/main')
        }
      })
  }

  loadData() {
    let dataOrder
    const deliveryData = this.userStore.getDeliveryParams()
    const tip = this.parseAppliedTip()
    this.checkoutStore.getOrderSummary(this.userStore.getHeaderAuth(), deliveryData, tip).then((data) => {
      this.setState({applicableStoreCreditAmount: this.checkoutStore.order.applicable_store_credit,
        appliedPromo: this.checkoutStore.order.promo_amount,
        appliedPromoCode: this.checkoutStore.order.promo,
      })

      dataOrder = data
      return data
    }).then(data => {
      if (!datesEqual(data.delivery_date, deliveryData.date) && deliveryData.date !== null) {
        return this.checkoutStore.getDeliveryTimes().then(() => {
          this.userStore.adjustDeliveryTimes(dataOrder.delivery_date, this.state.deliveryTimes)
          this.setState({invalidText: 'Please select delivery time'})
        })
      }
      return null
    }).catch((e) => {
      console.error(e)
    })
  }

  updateData() {
    const deliveryData = this.userStore.getDeliveryParams()
    const tip = this.parseAppliedTip()
    this.checkoutStore.getOrderSummary(this.userStore.getHeaderAuth(), deliveryData, tip).then((data) => {
      this.setState({applicableStoreCreditAmount: this.checkoutStore.order.applicable_store_credit,
        appliedPromo: this.checkoutStore.order.promo_amount,
        appliedPromoCode: this.checkoutStore.order.promo,
      })
    })
  }

  parseAppliedTip() {
    const { appliedTipAmount } = this.state
    let tipValue = appliedTipAmount

    if (typeof appliedTipAmount === 'string') {
      tipValue = appliedTipAmount.replace('$', '')
    }

    return (parseFloat(tipValue) * 100).toFixed()
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

  handleSelectAddress = (data) => {
    const selectedAddress  = this.userStore.selectedDeliveryAddress
    if (!selectedAddress || selectedAddress.address_id !== data.address_id) {
      this.setState({selectedAddress: data, selectedAddressChanged: true})
      this.userStore.setDeliveryAddress(data)
    } else {
      this.setState({selectedAddressChanged: false})
    }
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

    const response = await this.userStore.saveAddress(dataMap)
    const address = this.userStore.selectedDeliveryAddress
    this.userStore.setDeliveryAddress(address)
    this.setState({lockAddress: true})
    return response
  }

  handleSubmitAddress = async (address) => {
    this.userStore.setDeliveryAddress(address)
    this.setState({lockAddress: true})
  }

  handleUnlockAddress = () => {
    this.setState({lockAddress: false})
  }

  handleSubmitPayment = (lock, selectedPayment) => {
    logEvent({ category: "Checkout", action: "SubmitPayment" })
    this.setState({
      selectedPayment,
      lockPayment: lock,
    })
  }

  handleSelectTime = (selectedTime) => {
    this.modalStore.showDeliveryChange('time', selectedTime)
    this.setState({ invalidText: '' })
  }

  handleChangeDelivery = () => {
    this.updateData()
  }

  handleEdit(id, quantity) {
    this.productStore.showModal(id, quantity, this.userStore.getDeliveryParams())
      .then(() => {
        this.modalStore.toggleModal('product')
      })
  }

  handleDelete(data) {
    const id = {
      product_id : data.product_id,
      inventory_id : data.inventory[0]._id
    }
    this.modalStore.toggleModal('delete', id)
  }

  handlePlaceOrder() {
    const { placeOrderRequest } = this.state

    if (placeOrderRequest) {
      return
    }

    this.setState({invalidText: '', placeOrderRequest: true })
    if (!this.userStore.selectedDeliveryAddress) {
      this.setState({invalidText: 'Please select address', placeOrderRequest: false })
      return
    }

    if (!this.userStore.selectedDeliveryTime) {
      this.setState({invalidText: 'Please select delivery time', placeOrderRequest: false })
      return
    }

    if (!this.state.confirmHome) {
      this.setState({invalidText: 'Please confirm that you are home', placeOrderRequest: false})
      return
    }
    if (!this.state.lockPayment) {
      this.setState({invalidText: 'Please select payment', placeOrderRequest: false})
      return
    }
    logEvent({ category: "Checkout", action: "ConfirmCheckout" })

    this.checkoutStore.submitOrder({
      store_credit: this.state.appliedStoreCreditAmount > 0,
      user_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      address_id: this.userStore.selectedDeliveryAddress.address_id,
      payment_id: this.state.selectedPayment,
      delivery_time: this.userStore.selectedDeliveryTime.date + ' ' + this.userStore.selectedDeliveryTime.time,
      tip_amount: this.parseAppliedTip(),
    }, this.userStore.getHeaderAuth()).then((data) => {
      ReactGA.event({
        category: 'Order',
        action: 'Submit Order'
      });
      this.routing.push('/orders/' + data.order._id)
      this.checkoutStore.clearCart(this.userStore.getHeaderAuth())
      this.userStore.setDeliveryTime(null)
      this.setState({ placeOrderRequest: false })
    }).catch((e) => {
      console.error('Failed to submit order', e)
      const msg = e.response.data.error.message
      this.setState({ invalidText: msg, placeOrderRequest: false })
    })
  }

  handleCheckPromo = () => {
    const subTotal = this.checkoutStore.order.subtotal
    const promoCode = this.state.appliedPromoCode

    if (!promoCode) {
      this.setState({invalidText: 'Promo code empty'})
      return
    }
    logEvent({ category: "Checkout", action: "AddPromo", label: promoCode })
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

  handleAddTip = () => {
    if (!this.state.tipApplyEdited) {
      this.setState({ tipApplyEdited: true })
      this.updateData()
    }
  }

  handleChangeTip = e => {
    this.setState({
      tipApplyEdited: false,
      appliedTipAmount: e.target.value,
      invalidText: '',
    })
  }

  handleAddPayment = (data) => {
    return this.userStore.savePayment(data).then((data) => {
      logEvent({ category: "Checkout", action: "SubmitNewPayment" })
      this.userStore.setUserData(data)
      this.setState({selectedPayment: this.userStore.user.preferred_payment, newPayment: false})

      return data
    })
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

  showPackagingPopup = () => {
    this.setState({packagingdeposit: true})
  }

  hidePackagingPopup = () => {
    this.setState({packagingdeposit: false})
  }

  showTippingPopup = () => {
    this.setState({ tippingpopup: true })
  }

  hideTippingPopup = () => {
    this.setState({ tippingpopup: false })
  }

  handleConfirmHome() {
    logEvent({ category: "Checkout", action: "ConfirmAtHome" })
    this.setState({confirmHome: !this.state.confirmHome})
  }

  handleTipAmountChange = (value, clickedByUser) => {
    const order = this.checkoutStore.order
    const tipAmount = (value / 100) * order.subtotal
    this.setState({
      appliedTipAmount: (tipAmount / 100).toFixed(2),
      tipReadOnly: true,
      appliedTipAmountChanged: clickedByUser,
      freezedTipAmount: null,
    })
  }

  handleTipCustomAmounClick = () => {
    this.setState({
      tipReadOnly: false,
      freezedTipAmount: this.state.appliedTipAmount,
    })
  }

  updateTotal() {
    const order = this.checkoutStore.order
    const customTip = this.state.freezedTipAmount || this.state.appliedTipAmount
    let total = (order.total / 100)
    
    if (!order.tip_amount || this.state.appliedTipAmountChanged) {
      const currentTipAmount = order.tip_amount || 0 
      total = ((order.total - currentTipAmount) / 100) + parseFloat(customTip)
    }
    return total
  }

  updateTipAmount() {
    const order = this.checkoutStore.order
    const customTip = this.state.freezedTipAmount || this.state.appliedTipAmount
    const tipAmount = (order.tip_amount && !this.state.appliedTipAmountChanged)
      ? formatMoney(order.tip_amount/100)
      : formatMoney(customTip)
    
    return tipAmount
  }

  render() {
    if (!this.checkoutStore.order || !this.userStore.user) {
      return null
    }

    const order = this.checkoutStore.order

    const applicableStoreCreditAmount = this.state.applicableStoreCreditAmount ? this.state.applicableStoreCreditAmount / 100 : 0

    let buttonPlaceOrderClass = 'btn btn-main'
    if (this.userStore.selectedDeliveryAddress && this.state.lockPayment && this.userStore.selectedDeliveryTime && this.state.confirmHome && !this.state.placeOrderRequest) {
      buttonPlaceOrderClass += ' active' 
    }

    const cart_items = order && order.cart_items ? order.cart_items : []

    const orderTotal = this.updateTotal()

    return (
      <div className="App">
        <Title content="Checkout" />
        <div className="container">

          <div className="checkout-wrap">
            <div className="">
              <div style={{maxWidth: '440px'}}>
                {this.userStore.user && 
                  <DeliveryAddressOptions
                    lock={this.state.lockAddress}
                    editable={true}
                    selected={this.userStore.selectedDeliveryAddress ? this.userStore.selectedDeliveryAddress.address_id : null}
                    user={this.userStore.user}
                    onAddNew={this.handleAddNewAddress}
                    onSubmit={this.handleSubmitAddress}
                    onSelect={this.handleSelectAddress}
                    onUnlock={this.handleUnlockAddress}
                  />
                }
                {this.userStore.user && 
                    <DeliveryTimeOptions
                      lock={false}
                      data={this.state.deliveryTimes}
                      selected={this.userStore.selectedDeliveryTime}
                      onSelectTime={this.handleSelectTime}
                      title={true}
                    />
                }
                <div className="custom-control custom-checkbox mt-2 mb-3">
                  <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.state.confirmHome} onChange={e=>this.handleConfirmHome()} />
                  <label className="custom-control-label" onClick={e=>this.handleConfirmHome()}>I confirm that I will be at home or have a doorman</label>
                </div>
                <h3 className="m-0 mb-3 p-r mt-5">Payment 
                  { this.state.lockPayment ? <a onClick={e => this.setState({lockPayment: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
                </h3>
                <PaymentSelect
                  {...{
                    lockPayment: this.state.lockPayment,
                    userPayment: this.userStore.user.payment,
                    userPreferredPayment: this.userStore.user.preferred_payment,
                    onAddPayment: this.handleAddPayment,
                    onSubmitPayment: this.handleSubmitPayment,
                    userGuest: !this.userStore.status,
                  }}
                />
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
                    <div className={`summary ${this.state.taxpopup ? 'open' : ''}`}>
                      <span onClick={e=>this.showTaxPopup()}>Tax</span>
                      <span>{formatMoney((order.tax_amount)/100)}</span>
                    </div>
                    <div className={`summary ${this.state.servicepopup ? 'open' : ''}`}>
                      <ClickOutside onClickOutside={e=>this.hideServicePopup()}>
                        <div className="popover bs-popover-right" role="tooltip" x-placement="right"><div className="arrow"></div><h3 className="popover-header"></h3><div className="popover-body">
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
                    <div className={`summary ${this.state.packagingdeposit ? 'open' : ''}`}>
                      <ClickOutside onClickOutside={this.hidePackagingPopup}>
                        <div className="popover bs-popover-right" role="tooltip" x-placement="right" style={{left: '142px'}}><div className="arrow"></div><h3 className="popover-header"></h3><div className="popover-body">
                        This charge correlates to how many pieces of reusable packaging we lend you. Once you return our reusable packaging to a Wally Shop courier, you'll get the deposit back as store credit. <Link className="text-violet" to={"/help/topics/5b9158285e3b27043b178f90"}>Learn more</Link>
                        </div></div>
                      </ClickOutside>
                      <span onClick={this.showPackagingPopup}>Packaging deposit  <FontAwesome name='info-circle' /></span>
                      <span>{formatMoney(order.packaging_deposit/100)}</span>
                    </div>

                    <div className="summary">
                      <span>Applied Discount</span>
                      <span>-{formatMoney(order.promo_discount/100)}</span>
                    </div>

                    <div className="summary">
                      <span>Applied Store credit</span>
                      <span>-{formatMoney(order.applied_store_credit/100)}</span>
                    </div>

                    <div className={`summary ${this.state.tippingpopup ? 'open' : ''}`}>
                      <ClickOutside onClickOutside={this.hideTippingPopup}>
                        <div className="popover bs-popover-right" role="tooltip" x-placement="right" style={{left: '142px'}}><div className="arrow"></div><h3 className="popover-header"></h3><div className="popover-body">
                        100% of the tip amount goes to our shoppers and couriers, on top of the wages they earn.
                        </div></div>
                      </ClickOutside>
                      <span onClick={this.showTippingPopup}>Tip Amount  <FontAwesome name='info-circle' /></span>
                      <span>{this.updateTipAmount()}</span>
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

                                  {
                                    !this.state.appliedPromo ? 
                                      <div className="form-group">
                                        <span className="text-blue">Have a promo code</span>
                                        <div className="aw-input--group aw-input--group-sm">
                                          <Input
                                            className="aw-input--control aw-input--left aw-input--bordered"
                                            type="text"
                                            placeholder="Enter promocode here"
                                            onChange={(e) => this.setState({invalidText: '', appliedPromoCode: e.target.value})}/>

                                          <button onClick={this.handleCheckPromo} type="button" className="btn btn-transparent purple-apply-btn">APPLY</button>
                                        </div>
                                      </div>
                                      :null
                                  }
                                    <div className="form-group">
                                      <span className="text-blue">Want to tip</span>
                                      <AmountGroup
                                        className="checkout-tips"
                                        amountClick={this.handleTipAmountChange}
                                        customClick={this.handleTipCustomAmounClick}
                                        values={[0, 15, 20, 25]}
                                        selected={15}
                                        suffix="%"
                                      />
                                      <div className="aw-input--group aw-input--group-sm">
                                        <CurrencyInput
                                          readOnly={this.state.tipReadOnly}
                                          prefix="$"
                                          className={`aw-input--control aw-input--left aw-input--bordered form-control ${!this.state.tipReadOnly ? 'focus-input' : ''}`}
                                          value={this.state.appliedTipAmount}
                                          onChangeEvent={this.handleChangeTip}
                                        />
                                        {
                                          !this.state.tipReadOnly
                                            ? <button
                                                onClick={this.handleAddTip}
                                                type="button"
                                                className={`btn btn-transparent purple-apply-btn ${this.state.tipApplyEdited ? 'grey-btn' : ''}`}
                                              >APPLY</button>
                                            : null
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <hr className="mt-4" />
                                  <div className="item-total">
                                    <span>Total</span>
                                    <span>{formatMoney(orderTotal)}</span>
                                  </div>
                                  <button onClick={e => this.handlePlaceOrder()} className={buttonPlaceOrderClass}>PLACE ORDER</button>
                                  {this.state.invalidText ? <span className="text-error text-center d-block mt-2">{this.state.invalidText}</span>:null}
                                  {this.state.successText ? <span className="text-success text-center d-block mt-2">{this.state.successText}</span>:null}
                                </div>
                              </div>

                              <p className="mt-3">
                                Prices and totals are subject to final adjustments based on available products, weights and at-location prices. The packaging deposit will be returned to your account as store credit upon the return of used packaging during any future order. By placing your order, you agree to be bound by the Terms of Service and Privacy Policy. Your card will be temporarily authorized for an amount slightly greater than the estimated order total. Your statement will reflect the final order total after order completion. <Link to={"/help/topics/5b919926d94b070836bd5e4b"}>Learn more.</Link>
                            </p>
                            </section>
                          </div>
                        </div>
                      </div>
                      <DeliveryChangeModal onChangeSubmit={this.handleChangeDelivery} />
                    </div>
    );
  }
}

export default connect("store")(Checkout);
