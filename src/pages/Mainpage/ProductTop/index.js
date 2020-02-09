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

import Filters from './Filters'
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

      sticky: 0,
    }
  }

  componentDidMount() {
    const $ = window.$
    const self = this
    $(document).ready(function() {
      self.calculateSticyPosition()
    })
    $(window).bind('scroll', this.handleFixedTop)
    $(window).bind('resize', this.calculateSticyPosition)
  }

  componentWillUnmount() {
    const $ = window.$
    $(window).unbind('scroll', this.handleFixedTop)
    $(window).unbind('resize', this.calculateSticyPosition)
  }

  calculateSticyPosition = () => {
    const element = document.getElementsByClassName("aw-header")[0]
    const newSticky = element ? element.offsetHeight : 0
    this.setState({
      sticky: newSticky
    })
  }

  handleFixedTop = () => {
    const $ = window.$
    const { sticky } = this.state
    const stickyPos = sticky
    if (window.pageYOffset >= stickyPos) {
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
      if (!this.userStore.user.is_ecomm && !this.userStore.selectedDeliveryTime) {
        this.modalStore.toggleDelivery()
      } else {
        this.routing.push('/main/similar-products')
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
    this.modalStore.showDeliveryChange('time', this.state.selectedTime)
  }

  handleMouseEnter = () => {
    this.uiStore.showBackdrop()
  }

  handleMouseLeave = () => {
    this.uiStore.hideBackdrop()
  }

  handleFiltersSelect = values => {
    this.props.onFilterUpdate(values)
  }

  render() {
    const {
      selectedAddressChanged,
      selectedTimeChanged,
      fakeUser,
    } = this.state
    const { onSearch, onCategoryClick } = this.props
    const user = this.userStore.user ? this.userStore.user : fakeUser

    return (
      <div className="product-top">
        <Container>
          <Row>
            <Col
              xs="auto"
              className="pr-0 d-none d-lg-block"
            >
              <Link to="/main">
                <img src="/images/main_logo.svg" height="30" className="product-top-big-logo"/>
              </Link>
            </Col>
            <Col
              xs="auto"
              className="pr-0 d-lg-none small-logo"
            >
              <Link to="/main">
                <img src="/images/logo.png" height="40" />
              </Link>
            </Col>
            {/* <Col xs="auto" className="d-none d-md-block bdr-right">
              <div
                className="dropdown-address d-flex"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                <i className="fa fa-map-marker bar-icon" />
                {
                  this.userStore.selectedDeliveryAddress &&
                  <span className="dropdown-details align-self-center">{this.formatAddress(this.userStore.selectedDeliveryAddress.street_address)}</span>
                }
              </div>
              <div
                className="dropdown-wrapper"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
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
              <div
                className="dropdown-time d-flex"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                <i className="fa fa-clock-o bar-icon" />
                <span className="dropdown-details align-self-center">
                  {
                    this.userStore.selectedDeliveryTime
                      ? `${this.userStore.selectedDeliveryTime.day}, ${this.userStore.selectedDeliveryTime.time}`
                      : null
                  }
                </span>
              </div>
              <div
                className="dropdown-wrapper"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
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
            </Col> */}
            {/* <Col xs={2} className="d-none d-md-block bdr-right">
              <h3
                className="dropdown-categories"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                <b>Categories</b><i className="fa fa-chevron-down d-none d-lg-block" />
              </h3>

              <div
                className="dropdown-wrapper dropdown-fwidth"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                <div className="dropdown-menu dropdown-menu-right">
                  <Link
                    to="/main"
                    className="dropdown-item"
                    onClick={onCategoryClick}
                  >All Categories</Link>
                  {
                    this.productStore.categories.map(s => (
                      <Link
                        to={`/main/${s.cat_id ? s.cat_id : ''}`}
                        className="dropdown-item"
                        key={s.cat_id}
                        onClick={onCategoryClick}
                      >{s.cat_name}</Link>
                    ))
                  }
                </div>
              </div>
            </Col> */}
            <Col className="d-none d-lg-block">
              <Filters onSelect={this.handleFiltersSelect} />
            </Col>
            <Col>
              <div className="d-flex align-items-start">
                <SearchBar
                  onSearch={onSearch}
                />
                <Link
                  className="d-none d-md-block ml-3"
                  to="/main/buyagain"
                >
                  <img src="/images/reorder.png" height="40" />
                </Link>
                <span className="d-none d-md-block">
                  <CartDropdown
                    ui ={this.uiStore}
                    cart={this.checkoutStore.cart}
                    onCheckout={this.handleCheckout}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                  />
                </span>
              </div>
            </Col>
            {/* <Col xs="auto" className="d-block d-md-none">
              <div
                className="dropdown-time d-flex"
                onClick={() => this.modalStore.toggleDelivery()}
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
            </Col> */}
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
