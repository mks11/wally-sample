import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Container,
} from 'reactstrap'
import { connect, logEvent } from 'utils'
import DeliveryTimeOptions from 'common/DeliveryTimeOptions'
import DeliveryAddressOptions from 'common/DeliveryAddressOptions'

import SearchBar from './SearchBar'
import CartDropdown from './CartDropdown'

class ProductTop extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.uiStore = props.store.ui
    this.productStore = props.store.product
    this.checkoutStore = props.store.checkout
    this.routing = props.store.routing
    this.modalStore = props.store.modal

    this.state = {
      selectedAddressChanged: false,
      selectedTimeChanged: false,
      selectedAddress: this.userStore.selectedDeliveryAddress,
      selectedTime: this.userStore.selectedDeliveryTime,
      fakeUser: this.userStore.loadFakeUser(),
    }
  }

  componentDidMount() {
    const $ = window.$
    $(window).bind('scroll', this.handleFixedTop)
  }

  componentWillUnmount() {
    const $ = window.$
    $(window).unbind('scroll', this.handleFixedTop)
  }

  handleFixedTop() {
    const $ = window.$
    if (window.innerWidth <= 500) {
      return
    }
    if ($(window).scrollTop() > 570) {
      $('.product-top').addClass('fixed');
    } else {
      $('.product-top').removeClass('fixed');
    }
  }

  formatAddress(address) {
    return address ? address.substr(0, 25).concat('...') : null
  }

  handleCheckout = () => {
    if (this.userStore.status) {
      if (!this.userStore.selectedDeliveryTime) {
        this.modalStore.toggleModal('delivery')
      } else {
        this.routing.push('/checkout')
      }
    } else {
      this.modalStore.toggleModal('login')
    }
  }

  handleEdit = data => {
    this.productStore.showModal(data.product_id, data.customer_quantity, this.userStore.getDeliveryParams())
      .then(data => {
        this.userStore.adjustDeliveryTimes(data.delivery_date, this.checkoutStore.deliveryTimes)
        this.modalStore.toggleModal('product')
      })
  }

  handleDelete =id => {
    this.modalStore.toggleModal('delete', id)
  }

  handleMobileSearchOpen = () => {
    const { onMobileSearchClick } = this.props
    onMobileSearchClick && onMobileSearchClick()
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
    this.modalStore.showDeliveryChange('address', {
      address,
    })
    this.userStore.setDeliveryAddress(address)
    return
  }

  handleSelectAddress = (data) => {
    const selectedAddress  = this.userStore.selectedDeliveryAddress
    if (!selectedAddress || selectedAddress.address_id !== data.address_id) {
      this.setState({selectedAddress: data, selectedAddressChanged: true})
    } else {
      this.setState({selectedAddressChanged: false})
    }
  }

  handleSubmitDeliveryAddress= () => {
    logEvent({ category: "DeliveryOptions", action: "ClickEditAddressChoice" })
    if (!this.state.selectedAddressChanged) {
      return
    }
    this.checkoutStore.getDeliveryTimes().then(() => {
      this.modalStore.showDeliveryChange('address', {
        address: this.state.selectedAddress,
        times: this.checkoutStore.deliveryTimes 
      })
    })
  }

  handleSelectTime = (data) => {
    const selectedTime  = this.userStore.selectedDeliveryTime
    if (!selectedTime || (selectedTime.date !== data.date || selectedTime.time !== data.time || selectedTime.day !== data.day)) {
      this.setState({selectedTime: data, selectedTimeChanged: true})
      logEvent({ category: "DeliveryOptions", action: "ClickEditTimeChoice" })
    } else {
      this.setState({selectedTimeChanged: false})
    }
  }

  handleSubmitDeliveryTime= () => {
    logEvent({ category: "DeliveryOptions", action: "ClickEditTimeChoice" })
    if (!this.state.selectedTimeChanged) {
      return
    }

    this.setState({ selectedTimeChanged: false })
    this.userStore.setDeliveryTime(this.state.selectedTime)
    this.modalStore.showDeliveryChange('time', this.state.selectedTime)
  }

  render() {
    const {
      selectedAddressChanged,
      selectedTimeChanged,
      fakeUser,
    } = this.state
    const { onSearch } = this.props
    const user = this.userStore.user ? this.userStore.user : fakeUser

    return (
      <div className="product-top">
        <Container>
          <Row>
            <Col xs="auto" className="d-none d-md-block bdr-right">
              <div className="dropdown-address d-flex">
                <i className="fa fa-map-marker bar-icon" />
                { 
                  this.userStore.selectedDeliveryAddress &&
                  <span className="dropdown-details align-self-center">{this.formatAddress(this.userStore.selectedDeliveryAddress.street_address)}</span>
                }
              </div>
              <div className="dropdown-wrapper">
                <div className="dropdown-menu dropdown-large p-3">

                  <h3 className="m-0 mb-3 p-r">Delivery address</h3>
                  <div className="scroller">
                    <DeliveryAddressOptions
                      title={false}
                      button={false}
                      lock={false}
                      selected={
                        this.userStore.selectedDeliveryAddress 
                          ? this.userStore.selectedDeliveryAddress.address_id
                          : this.userStore.user
                            ? this.userStore.user.preferred_address
                            : null
                          }
                      user={user}
                      onAddNew={this.handleAddNewAddress}
                      onSubmit={this.handleSubmitAddress}
                      onSelect={this.handleSelectAddress}
                      locking={false}
                    />
                  </div>
                  <button className={`btn btn-main ${selectedAddressChanged ? 'active' : ''}`} onClick={this.handleSubmitDeliveryAddress}>SUBMIT</button>
                </div>
              </div>
            </Col>
            <Col xs="auto" className="d-none d-md-block bdr-right">
              <div className="dropdown-time d-flex">
                <i className="fa fa-clock-o bar-icon" />
                <span className="dropdown-details align-self-center">
                  {
                    this.userStore.selectedDeliveryTime
                      ? `${this.userStore.selectedDeliveryTime.day}, ${this.userStore.selectedDeliveryTime.time}`
                      : null
                  }
                </span>
              </div>
              <div className="dropdown-wrapper">
                <div className="dropdown-menu dropdown-large p-3">
                  <h3 className="m-0 mb-3 p-r">Time</h3>
                  <div className="scroller">
                    <DeliveryTimeOptions
                      title={false}
                      lock={false}
                      data={this.checkoutStore.deliveryTimes}
                      selected={this.userStore.selectedDeliveryTime}
                      onSelectTime={this.handleSelectTime}
                    />
                  </div>
                  <div className="font-italic mb-1 text-center">Order by 2:00PM for same day delivery</div>
                  <button className={`btn btn-main ${selectedTimeChanged ? 'active' : ''}`} onClick={this.handleSubmitDeliveryTime}>SUBMIT</button>
                </div>
              </div>
            </Col>
            <Col xs={2} className="d-none d-md-block bdr-right">
              <h3 className="dropdown-categories">
                <b>Categories</b><i className="fa fa-chevron-down d-none d-lg-block" />
              </h3>

              <div className="dropdown-wrapper dropdown-fwidth">
                <div className="dropdown-menu dropdown-menu-right">
                  <Link to="/main" className="dropdown-item">All Categories</Link>
                  {
                    this.productStore.categories.map((s,i) => (
                      (!s.parent_id && s.cat_id.length <= 3) &&
                        <Link
                          to={"/main/"+ (s.cat_id ? s.cat_id:'')}
                          className="dropdown-item"
                          key={i}
                        >{s.cat_name}</Link>
                    ))
                  }
                </div>
              </div>
            </Col>
            <Col className="d-none d-md-block">
              <div className="d-flex align-items-start">
                <SearchBar
                  onSearch={onSearch}
                />
                <CartDropdown
                  cart={this.checkoutStore.cart}
                  onCheckout={this.handleCheckout}
                  onEdit={this.handleEdit}
                  onDelete={this.handleDelete}
                />
              </div>
            </Col>
            <Col xs="auto" className="d-block d-md-none">
              <div
                className="dropdown-time d-flex"
                onClick={() => this.modalStore.toggleModal('delivery')}
              >
                <i className="fa fa-clock-o bar-icon" />
                <span className="dropdown-details-mobile align-self-center">
                  {
                    this.userStore.selectedDeliveryTime
                      ? `${this.userStore.selectedDeliveryTime.day}, ${this.userStore.selectedDeliveryTime.time}`
                      : null
                  }
                </span>
              </div>
            </Col>
            <Col xs="auto" className="d-block d-md-none ml-auto">
              <button
                className="btn btn-transparent"
                onClick={this.handleMobileSearchOpen}
              >
                <span className="catsearch-icon"></span>
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default connect('store')(ProductTop)