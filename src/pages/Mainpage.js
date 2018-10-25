import React, { Component } from 'react';
import Title from '../common/page/Title'
import { formatMoney, connect } from '../utils'
import { Link } from 'react-router-dom'
import { APP_URL, PRODUCT_BASE_URL } from '../config'
import {MenuItem, MenuItemContainer, AsyncTypeahead} from 'react-bootstrap-typeahead'
import ClickOutside from 'react-click-outside'
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

import DeliveryModal from '../common/DeliveryModal.js';
import DeliveryChangeModal from '../common/DeliveryChangeModal.js';
import DeliveryTimeOptions from '../common/DeliveryTimeOptions.js';
import DeliveryAddressOptions from '../common/DeliveryAddressOptions.js';
import ProductModal from '../common/ProductModal';

const banner1 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/banner-1.png'
const banner2 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/banner-2.png'
const banner3 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/banner-3.png'

const bannerMobile1 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-banner-1.png'
const bannerMobile2 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-banner-2.png'
const bannerMobile3 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-banner-3.png'

const bannerMobileHoriz1 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-horiz-banner-1.png'
const bannerMobileHoriz2 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-horiz-banner-2.png'
const bannerMobileHoriz3 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/mobile-horiz-banner-3.png'

const heroItems = [
  {
    src: banner1,
    altText: 'Slide 1',
    caption: 'Slide 1',
    link: '/help/detail/5b9159765e3b27043b178f93'
  },
  {
    src: banner2,
    altText: 'Slide 2',
    caption: 'Slide 2',
    link: '/help/detail/5b91595b5e3b27043b178f92'
  },
  {
    src: banner3,
    altText: 'Slide 3',
    caption: 'Slide 3',
    link: '/help/topics/5b9158325e3b27043b178f91'
  },
];

if (window.innerWidth <= 800 && window.innerWidth > 500) {
  heroItems[0].src = bannerMobileHoriz1
  heroItems[1].src = bannerMobileHoriz2
  heroItems[2].src = bannerMobileHoriz3
}

if (window.innerWidth <= 500) {
  heroItems[0].src = bannerMobile1
  heroItems[1].src = bannerMobile2
  heroItems[2].src = bannerMobile3
}



class Product extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user
    this.productStore = this.props.store.product
  }

  handleProductModal() {
    if (!this.userStore.selectedDeliveryAddress && !this.userStore.selectedDeliveryTime) {
      this.userStore.toggleDeliveryModal(true)
      this.productStore.activeProductId = this.props.product.product_id
    } else {
      console.log(this.userStore.getDeliveryParams())
      this.productStore.showModal(this.props.product.product_id, null, this.userStore.getDeliveryParams())
    }
  }

  render() {
    const product = this.props.product
    let price = product.product_price/100
    let price_unit = product.product_size

    let unit = 1
    if (price_unit) {
      unit = parseFloat(price_unit.split(' ')[0])
    } else {
      price_unit = unit + ' ' + product.unit_type
    }

    if (product.unit_type === 'unit') {
      price_unit = ''
    }

    // price *= unit

    return ( <div className="col-6 col-lg-3 col-md-4 col-sm-6 product-thumbnail" onClick={e => this.handleProductModal()}>
      <img src={PRODUCT_BASE_URL + product.product_id + "/" + product.image_refs[0]} />
      <div className="row product-detail">
        <div className="col-6 product-price">
          {formatMoney(price)}
        </div>
        <div className="col-6 product-weight">
          {price_unit}
        </div>
      </div>
      { product.product_name && <span className="product-desc">{product.product_name}</span>}
      { product.name && <span className="product-desc">{product.name}</span>}
    </div>
    )
  }
}

Product = connect("store")(Product)

const ProductList = ({display, mode}) => (
  <div className="product">
    <h2>{display.cat_name}</h2>
    <div className="product-sub">
      <h5>{display.cat_name}</h5>
      <Link to={"/main/" + display.cat_id }>View All {display.number_products} ></Link>
    </div>

    <div className="row">
      { display.products.map((p, i) => {
        return (<Product key={i} product={p} />)
      }
      )}

      {mode == 'limit' && 
          <Link className="big-arrow" to={"/main/" + display.cat_id }>
          </Link>
      }
    </div>
  </div>
)

class Mainpage extends Component {

  constructor(props){
    super(props)

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.routing = this.props.store.routing
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout

    this.state = {
      searchAhead: [],
      searchAheadLoading: false,
      searchPage: false,
      searchResult:[],
      searchDisplayed:[],
      searchTerms: '',
      searchFilter: [],
      searchAll: true,

      activeHeroIndex: 0,

      sidebar:[],
      searchSidebar:[],

      currentSearchCat: null,
      currentSearchCatId: null,

      cartDropdown: false,
      categoriesDropdown: false,
      categoryTypeMode: 'limit',

      deliveryTimeDetail: 0,
      deliveryTimeDropdown: false,
      deliveryAddressDropdown: false,

      fakeUser: this.userStore.loadFakeUser(),

      selectedAddress: this.userStore.selectedDeliveryAddress,
      selectedTime: this.userStore.selectedDeliveryTime,

      selectedAddressChanged: false,
      selectedTimeChanged: false,


    }

    this.id = this.props.match.params.id

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSelected = this.handleSelected.bind(this)

  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        this.loadData()
        const selectedAddress = this.userStore.selectedDeliveryAddress 
        if (selectedAddress) {
          this.checkoutStore.getDeliveryTimes(selectedAddress).then((data) => {
            const deliveryTimes = this.checkoutStore.transformDeliveryTimes(data)
            this.setState({deliveryTimes})
          })
        }

      })

    const $ = window.$

    const self = this

    $(window).bind('scroll', function () {
      let thTop = 570
      if (window.innerWidth <= 500) {
        thTop = 731
      }
      if ($(window).scrollTop() > thTop) {
        $('.product-top').addClass('fixed');
        // self.uiStore.topBar = false
      } else {
        $('.product-top').removeClass('fixed');
        // self.uiStore.topBar = true && !self.uiStore.topBarClosed
      }

      // if ($(window).scrollTop() > 580) {
      //   $('.product-content-left').addClass('fixed')
      // } else {
      //   $('.product-content-left').removeClass('fixed')
      // }
      //

    })
  }

  loadData() {
    const id = this.props.match.params.id
    this.id = id

    let categoryTypeMode = 'all'

    if (!this.id || this.id.length <= 3) {
      categoryTypeMode = 'limit'
    }

    this.setState({categoryTypeMode})

    this.productStore.getAdvertisements()
    this.productStore.getCategories()
    this.productStore.getProductDisplayed(id, this.userStore.getDeliveryParams()).then((data) => {
      this.setState({sidebar: this.productStore.sidebar})
    }).catch((e) => console.error('Failed to load product displayed: ', e))

    this.checkoutStore.getCurrentCart(this.userStore.getHeaderAuth(), this.userStore.getDeliveryParams()).catch((e) => {
      console.error('Failed to load current cart', e)
    })
  }


  componentDidUpdate() {
    const id = this.props.match.params.id
    if (this.id !== id) {
      this.loadData()
    }
  }

  handleCheckout() {
    this.uiStore.toggleCartDropdown()
    if (this.userStore.status) {
      this.routing.push('/checkout')
    } else {
      this.modalStore.toggleLogin()
    }
  }

  handleCheckoutMobile() {
    if (this.userStore.status) {
      this.routing.push('/checkout')
    } else {
      this.uiStore.toggleCartMobile(false)
      this.modalStore.toggleLogin()
    }
  }

  handleEdit(data) {
    this.productStore.showModal(data.product_id, data.customer_quantity, this.userStore.getDeliveryParams())
  }

  handleDelete(id) {
    this.checkoutStore.toggleDeleteModal(id)
  }

  handleDeleteMobile(id) {
    this.uiStore.toggleCartMobile()
    this.checkoutStore.toggleDeleteModal(id)
  }

  handleSearch(keyword) {
    this.setState({searchAheadLoading: true})
    this.productStore.searchKeyword(keyword, this.userStore.getDeliveryParams()).then((data) => {
      this.setState({searchAhead: data.products, searchAheadLoading: false, searchResult: data})
    })
  }

  search(keyword) {
    this.uiStore.hideBackdrop()

    const instance = this._typeahead.getInstance();
    instance.blur();

    this.productStore.searchKeyword(keyword, this.userStore.getDeliveryParams()).then((data) => {
      let filters = []
      filters = data && data.filters ?
        data.filters : []

      let currentSearchCatId = null
      let currentSearchCat = ''
      let searchDisplayed = []
      if (data.filters.length > 0) {
        currentSearchCatId = filters[0].cat_id
        currentSearchCat = filters[0].cat_name
        searchDisplayed = data.products.filter((d) => {
          return d.subcat_id == currentSearchCatId
        })
      }

      const cur = []
      data.filters.map((d) => {
        cur.push(d.cat_id)
      })



      this.setState({searchSidebar: filters, 
        searchFilter: cur,
        searchAheadLoading: false, searchResult: data, searchPage: true, searchTerms: keyword, currentSearchCatId, currentSearchCat: 'All Categories', searchDisplayed: data.products })
    })
  }

  handleSearchSubmit(e) {
    if (e.keyCode === 13) {
      this.search(e.target.value)
    }
  }

  handleSelected(e) {
    if (!e) return
    if (e && e.length === 0) return

    this.search(e[0].name)
  }


  handleShowCartDropdown = () => {
    this.uiStore.toggleCartDropdown(true)
  }

  handleHideCartDropdown = () => {
    this.uiStore.toggleCartDropdown(false)
  }

  handleCategoriesDropdown = () => {
    this.uiStore.toggleCategoriesDropdown()
  }

  handleChangeSearchCategory(cat_id) {
    const data = this.state.searchResult
    const searchDisplayed = data.products.filter((d) => {
      return d.cat_id == cat_id
    })

    const current = data.filters.find((d) => {
      return d.cat_id == cat_id
    })

    this.setState({searchDisplayed: data.products, currentSearchCat: current.cat_name, currentSearchCatId: current.cat_id})


  }
  onHeroExiting = () => {
    this.animating = true;
  }

  onHeroExited = () => {
    this.animating = false;
  }

  nextHero = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeHeroIndex === heroItems.length - 1 ? 0 : this.state.activeHeroIndex + 1;
    this.setState({ activeHeroIndex: nextIndex });
  }

  previousHero = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeHeroIndex === 0 ? heroItems.length - 1 : this.state.activeHeroIndex - 1;
    this.setState({ activeHeroIndex: nextIndex });
  }

  goToHeroIndex = (newIndex) => {
    if (this.animating) return;
    this.setState({ activeHeroIndex: newIndex });
  }

  toggleSearchCheck(id) {
    const cur = this.state.searchFilter
    const index = cur.indexOf(id)
    if (index === -1) {
      cur.push(id)
    } else {
      cur.splice(index, 1)
    }

    const products = this.state.searchResult.products
    const filtered = products.filter((d) => {
      return cur.indexOf(d.cat_id) !== -1
    })

    let curCat = []

    this.state.searchResult.filters.map((d) => {
      if (cur.indexOf(d.cat_id) !== -1) 
        curCat.push(d.cat_name)
    })
    let currentSearchCat= curCat.join(', ')

    let all = false

    if (cur.length === this.state.searchResult.filters.length) {
      all = true
      currentSearchCat = 'All Categories'
    }

    this.setState({searchAll: all, searchFilter: cur, searchDisplayed: filtered, currentSearchCat})

  }

  searchCheck(id) {
    return this.state.searchFilter.indexOf(id) !== -1
  }

  toggleSearchAll() {
    if (!this.state.searchAll) {
      const curFilter = []
      const current = this.state.searchResult.filters.map((d) => {
        curFilter.push(d.cat_id)
      })
      this.setState({searchFilter: curFilter, searchDisplayed: this.state.searchResult.products, currentSearchCat: 'All Categories'})
    }
    this.setState({searchAll: !this.state.searchAll})
  }

  handleAllCategoriesDropdown() {
    this.uiStore.hideCategoriesDropdown()
    this.setState({searchPage: false})
  }

  handleCarouselClick(link) {
    this.routing.push(link)
  }

  handleSearchMobile(e) {
    if (e.keyCode === 13) {
      this.uiStore.toggleCategoryMobile()
      this.search(e.target.value)
    }
  }

  limitDisplay = (data) => {
    const display = []
    for (let i = 0; i < 4; i++) {
      display.push(data[i])
    }


    return display
  }


  handleShowDeliveryAddressDetail = () => {
    this.setState({deliveryAddressDetail: true})
  }

  handleHideDeliveryAddressDetail = () => {
    this.setState({deliveryAddressDetail: false})
  }

  handleShowDeliveryTimeDetail = () => {
    this.setState({deliveryTimeDetail: true})
  }

  handleHideDeliveryTimeDetail = () => {
    this.setState({deliveryTimeDetail: false})
  }

  toggleDeliveryTimeDropdown = () => {
    this.setState({deliveryTimeDropdown: !this.state.deliveryTimeDropdown})
      this.uiStore.backdrop = true
  }

  toggleDeliveryAddressDropdown = () => {
    this.setState({deliveryAddressDropdown: !this.state.deliveryAddressDropdown})
    this.uiStore.backdrop = true
  }

  hideDeliveryTimeDropdown = () => {
    if (this.state.deliveryTimeDropdown) {
      this.setState({deliveryTimeDropdown: false})
      this.uiStore.backdrop = false
    }
  }

  hideDeliveryAddressDropdown = () => {
    if (this.state.deliveryAddressDropdown) {
      this.setState({deliveryAddressDropdown: false})
      this.uiStore.backdrop = false
    }
  }

  handleSubmitAddress = async (address) => {
    this.checkoutStore.getDeliveryTimes(address).then((deliveryTimes) => {
      const times = this.checkoutStore.transformDeliveryTimes(deliveryTimes)
      this.setState({selectedAddressChanged: false})
      this.modalStore.showDeliveryChange('address', {
        address,
        times 
      })
    })
    return
  }

  handleSelectTime = (data) => {
    const selectedTime  = this.userStore.selectedDeliveryTime
    if (!selectedTime || (selectedTime.date !== data.date || selectedTime.time !== data.time || selectedTime.day !== data.day)) {
      this.setState({selectedTime: data, selectedTimeChanged: true})
    } else {
      this.setState({selectedTimeChanged: false})
    }
  }

  handleSelectAddress = (data) => {
    const selectedAddress  = this.userStore.selectedDeliveryAddress
    if (!selectedAddress || selectedAddress.address_id !== data.address_id) {
      this.setState({selectedAddress: data, selectedAddressChanged: true})
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
    this.userStore.setUserData(response)
    return response

  }

  formatAddress(street_address) {
    return street_address.substr(0, 25) + '...'
  }

  handleChangeDelivery = () => {
    // this.setState({selectedAddressChanged: false, selectedTimeChanged: false})
    this.loadData()
    const address = this.userStore.selectedDeliveryAddress
    this.checkoutStore.getDeliveryTimes(address).then((deliveryTimes) => {
      const times = this.checkoutStore.transformDeliveryTimes(deliveryTimes)
      this.setState({deliveryTimes: times})
    })
  }

  handleSubmitDeliveryAddress= () => {
    if (!this.state.selectedAddressChanged) {
      return
    }
    const address = this.state.selectedAddress
    this.checkoutStore.getDeliveryTimes(address).then((deliveryTimes) => {
      const times = this.checkoutStore.transformDeliveryTimes(deliveryTimes)
      this.setState({deliveryTimes: times})
      this.modalStore.showDeliveryChange('address', {
        address,
        times 
      })
    })
  }

  handleSubmitDeliveryTime= () => {
    if (!this.state.selectedTimeChanged) {
      return
    }

      this.setState({selectedTimeChanged: false})
    this.modalStore.showDeliveryChange('time', this.state.selectedTime)
  }

  render() {
    const id = this.props.match.params.id

    let categoriesDropdownClass = 'dropdown-menu dropdown-menu-right'
    if (this.uiStore.categoriesDropdown) {
      categoriesDropdownClass += ' show'
    }


    let cartMobileClass = 'cart-mobile d-md-none'
    if (this.uiStore.cartMobile) {
      cartMobileClass += ' open'
    }

    let categoryMobileClass = 'category-mobile d-md-none'
    if (this.uiStore.categoryMobile) {
      categoryMobileClass += ' open'
    }

    let cartCount = 0, cartItems = [], cartSubtotal = 0

    if (this.checkoutStore.cart) {
      const cart_items = this.checkoutStore.cart.cart_items
      cartCount = cart_items.length
      cartItems = cart_items
      cartSubtotal = this.checkoutStore.cart.subtotal / 100
    }

    let deliveryAddressDetailClass = 'd-none'
    if (this.state.deliveryAddressDetail) {
      deliveryAddressDetailClass = ' d-block'
    }

    let deliveryTimeDetailClass = 'd-none'
    if (this.state.deliveryTimeDetail) {
      deliveryTimeDetailClass = ' d-block'
    }

    let cartDropdownClass = 'dropdown-menu dropdown-menu-right'
    if (this.uiStore.cartDropdown) {
      cartDropdownClass += ' show'
    }


    let buttonCart = 'product-cart-counter'
    if (cartItems.length>0) {
      buttonCart += ' active'
    }


    let deliveryTimeDropdownClass = 'dropdown-menu dropdown-large p-3'
    if (this.state.deliveryTimeDropdown) {
      deliveryTimeDropdownClass += ' show'
    }

    let deliveryAddressDropdownClass = 'dropdown-menu dropdown-large p-3'
    if (this.state.deliveryAddressDropdown) {
      deliveryAddressDropdownClass += ' show'
    }

    const mainDisplay = this.productStore.main_display


    // const ads1 = this.productStore.ads1 ? this.productStore.ads1 : '/images/shop_banner_1.png'
    // const ads2 = this.productStore.ads2 ? this.productStore.ads2 : '/images/shop_banner_2.png'

    const ads1 = this.productStore.ads1 ? this.productStore.ads1 :null
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 :null

    const { activeHeroIndex } = this.state;

    const slides = heroItems.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onHeroExiting}
          onExited={this.onHeroExited}
          key={item.caption}
        >
          <img className="img-fluid" src={item.src} alt={item.altText} onClick={e=>this.handleCarouselClick(item.link)} />
        </CarouselItem>
      );
    });


    const user = this.userStore.user ? this.userStore.user : this.state.fakeUser

    let submitAddressClass = "btn btn-main"
    if (this.state.selectedAddressChanged) {
      submitAddressClass += " active"
    }

    let submitTimeClass = "btn btn-main"
    if (this.state.selectedTimeChanged) {
      submitTimeClass += " active"
    }

    return (
      <div className="App">

        <Carousel
          activeIndex={activeHeroIndex}
          next={this.nextHero}
          previous={this.previousHero}
        >
          <CarouselIndicators items={heroItems} activeIndex={activeHeroIndex} onClickHandler={this.goToHeroIndex} />
          {slides}
        </Carousel>
        {/* Product Top */}
        <div className="product-top">
          <div className="container">
            <div className="row">
              <div className="d-md-none col-sm-12">
                <div className="row">
                  <div className="col-10">
                    <h3>Categories</h3>
                  </div>

                  <div className="col-2">
                    <button className="btn btn-transparent" onClick={e=>this.uiStore.toggleCategoryMobile()}><span className="catsearch-icon"></span></button>
                  </div>
                </div>
                <div className="row mt-2" onClick={e => this.userStore.toggleDeliveryModal(true)}>
                  <div className="col-auto">
                    <div className="d-flex justify-content-between">
                      <i className="fa fa-map-marker bar-icon"></i>
                      <span style={{lineHeight: '37px'}}>
                        {this.userStore.selectedDeliveryAddress && 
                          <React.Fragment>
                            {this.formatAddress(this.userStore.selectedDeliveryAddress.street_address)}
                          </React.Fragment>
                        }
                      </span>
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="d-flex justify-content-between">
                      <i className="fa fa-clock-o bar-icon"></i>
                      <span style={{lineHeight: '37px'}}>{this.userStore.selectedDeliveryTime !== null ?
                        <React.Fragment>
                          {this.userStore.selectedDeliveryTime.day}, {this.userStore.selectedDeliveryTime.time}
                        </React.Fragment>
                        : null
                      }

                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-8 right-column d-none d-md-block">
              <div className="row">

                <div className="col-auto" >
                  <div className="left-column pr-3">
                    <ClickOutside onClickOutside={this.hideDeliveryAddressDropdown} >
                      <div className="d-flex justify-content-between"
                        onClick={this.toggleDeliveryAddressDropdown}
                        onMouseEnter={this.handleShowDeliveryAddressDetail} onMouseLeave={this.handleHideDeliveryAddressDetail}>
                        <i className="fa fa-map-marker bar-icon"></i>
                        <span className={deliveryAddressDetailClass}>
                        {this.userStore.selectedDeliveryAddress && 
                          <React.Fragment>
                            {this.formatAddress(this.userStore.selectedDeliveryAddress.street_address)}
                          </React.Fragment>
                        }
                          </span>
                      </div>

                    <div className={deliveryAddressDropdownClass}>

                      <h3 className="m-0 mb-3 p-r">
                        Delivery address
                      </h3>
                      <div className="scroller">
                        <DeliveryAddressOptions
                          title={false}
                          button={false}
                          lock={false}
                          selected={this.userStore.selectedDeliveryAddress ? this.userStore.selectedDeliveryAddress.address_id : null}
                          user={user}
                          onUnlock={this.handleUnlockAddress}
                          onAddNew={this.handleAddNewAddress}
                          onSubmit={this.handleSubmitAddress}
                          onSelect={this.handleSelectAddress}
                          locking={false}
                        />
                      </div>
                      <button className={submitAddressClass} onClick={this.handleSubmitDeliveryAddress}>SUBMIT</button>
                    </div>
                    </ClickOutside>
                  </div>

                  <div className="left-column px-3">
                    <ClickOutside onClickOutside={this.hideDeliveryTimeDropdown} >
                      <div className="d-flex justify-content-between" onClick={this.toggleDeliveryTimeDropdown}
                        onMouseEnter={this.handleShowDeliveryTimeDetail} onMouseLeave={this.handleHideDeliveryTimeDetail}>
                        <i className="fa fa-clock-o bar-icon"></i>
                        <span className={deliveryTimeDetailClass}>
                          {this.userStore.selectedDeliveryTime !== null ?
                            <React.Fragment>
                              {this.userStore.selectedDeliveryTime.day}, {this.userStore.selectedDeliveryTime.time}
                            </React.Fragment>
                            : null
                          }
                        </span>
                      </div>


                      <div className={deliveryTimeDropdownClass}>
                      <h3 className="m-0 mb-3 p-r">
                        Time
                      </h3>
                      <div className="scroller">
                        <DeliveryTimeOptions
                          title={false}
                          lock={false}
                          data={this.state.deliveryTimes}
                          selected={this.userStore.selectedDeliveryTime}
                          isAddressSelected={true}
                          onSelectTime={this.handleSelectTime}
                        />
                      </div>

                      <button className={submitTimeClass} onClick={this.handleSubmitDeliveryTime}>SUBMIT</button>
                      </div>

                    </ClickOutside>

                  </div>


                </div>


                <div className="col-2 left-column" style={{width:200}}>
                  <div className="dropdown dropdown-fwidth">

                    <ClickOutside onClickOutside={e => this.uiStore.hideCategoriesDropdown()} className="pt-1">
                      <h3 onClick={this.handleCategoriesDropdown}><strong>Categories</strong> <i className="fa fa-chevron-down"></i></h3>

                      <div className={categoriesDropdownClass} aria-labelledby="dropdownMenuButton">
                        <Link to="/main" className="dropdown-item" onClick={e=>this.handleAllCategoriesDropdown()}>All Categories</Link>

                        {this.productStore.categories.map((s,i) => (
                          <React.Fragment key={i}>
                            {(!s.parent_id && s.cat_id.length<=3) && <Link to={"/main/"+ (s.cat_id ? s.cat_id:'')} className="dropdown-item" key={i} onClick={e=> this.uiStore.hideCategoriesDropdown()}>{s.cat_name}</Link>}
                          </React.Fragment>

                        ))}
                      </div>
                    </ClickOutside>
                  </div>
                </div>
                <div className="media col">
                  <div className="media-body">
                    <div className="input-group search-product">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><i className="fa fa-search"></i></div>
                      </div>
                      <AsyncTypeahead
                        filterBy={['name']}
                        allowNew={false}
                        isLoading={this.state.searchAheadLoading}
                        multiple={false}
                        options={this.state.searchAhead}
                        onMenuShow={e => this.uiStore.showBackdrop(70)}
                        onMenuHide={e => this.uiStore.hideBackdrop(70)}
                        labelKey="name"
                        minLength={3}
                        onSearch={this.handleSearch}
                        onKeyDown={this.handleSearchSubmit}
                        onChange={this.handleSelected}
                        ref={(ref) => this._typeahead = ref}
                        placeholder="Search for anything..."
                        emptyLabel="No matches found"
                      />
                    </div>
                  </div>
                  <div className="media-right">

                    <ClickOutside onClickOutside={e => this.uiStore.hideCartDropdown()}>
                      <div className="btn-group dropdown-cart d-none d-md-block" onMouseEnter={this.handleShowCartDropdown} 
                      >
                        <div className={buttonCart}>
                          <i className="fa fa-shopping-bag"></i><span><strong>{cartCount} {cartCount > 1 ? 'Items' : 'Item'}</strong></span>
                        </div>

                        <div className={cartDropdownClass} aria-labelledby="dropdownMenuButton">
                          { (cartItems && cartItems.length > 0) ?
                              <div>
                                <h3 className="px-3">Orders:</h3>
                                <div className="order-summary">
                                  <div className="order-scroll px-3">
                                    { cartItems.map((c, i) => (
                                      <div className="item mt-3 pb-2" key={i}>
                                        <div className="item-left">
                                          <h4 className="item-name">{c.product_name}</h4>
                                          <span className="item-detail mb-1">{c.packaging_name}</span>
                                          <div className="item-link">
                                            <a className="text-blue mr-2" onClick={e => this.handleEdit({product_id: c.product_id, customer_quantity: c.customer_quantity})}>EDIT</a>
                                            <a className="text-dark-grey" onClick={e => this.handleDelete({product_id: c.product_id, inventory_id: c._id})}>DELETE</a>
                                          </div>
                                        </div>
                                        <div className="item-right">
                                          <h4>x{c.customer_quantity}</h4>
                                          <span className="item-price">{formatMoney(c.total/100)}</span>
                                        </div>
                                      </div>

                                    ))}
                                  </div>
                                  <div className="item-total px-3">
                                    <span>Total</span>
                                    <span>{formatMoney(cartSubtotal)}</span>
                                  </div>
                                </div>
                                <button onClick={e => this.handleCheckout()} className="btn mx-3 w-90 btn-main active">CHECKOUT</button>
                              </div>
                              : 
                              <span className="px-3">No items in cart</span>
                          }

                        </div>
                      </div>
                    </ClickOutside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="product-content">
        <div className="container">
          <div className="row ">
            <div className="col-md-2 col-sm-4">
              {/* <div className="product-content-left d-none d-md-block d-lg-block"> */}
                <div className="product-content-left">
                  <div className="mb-4">
                    <h4>The Wally Shop</h4>
                    <ul>
                      <li><Link to="/about">About</Link></li>
                      <li><Link to="/help">Help</Link></li>
                    </ul>
                  </div>

                  {/*                  <div className="mb-4">
                    <h4 className="mb-4"><Link to="/main" className={id ? "": "text-violet"}>All Categories</Link></h4>
                  </div>
                  */
                  }

                  {!this.state.searchPage && this.state.sidebar.map((s,i) => {

                    let parentSidebarClass = ''
                    let link = '/main/'

                    if (id === s.cat_id) {
                      parentSidebarClass = 'text-violet'
                    }
                    link += s.cat_id

                    // if (typeof id === 'undefined' && !s.cat_id) {
                    //   parentSidebarClass = 'text-violet'
                    //   link = '/main'
                    // }

                    return (
                      <div className="mb-0" key={i}>
                        <h4><Link to={link} className={parentSidebarClass} replace>{s.cat_name}</Link></h4>
                        <ul>  
                          {s.subcats && s.subcats.map((sc, idx) => (
                            <li key={idx}><Link to={"/main/" + (sc.cat_id ? sc.cat_id: '')} 
                                className={id === sc.cat_id ? "text-violet": ""}
                              >{sc.cat_name}</Link></li>
                          ) )}
                        </ul>
                      </div>
                    )
                  })}

                  {this.state.searchPage && <h4>Sub Categories</h4>}
                  {this.state.searchPage && 
                      <React.Fragment>
                        <div  className="custom-control custom-checkbox mt-2 mb-3">
                          <input type="checkbox" className="custom-control-input" checked={this.state.searchAll} onChange={e=>this.toggleSearchAll()} />
                          <label className="custom-control-label" onClick={e=>this.toggleSearchAll()}>All Categories</label>
                        </div>

                        {this.state.searchSidebar.map((s,key) => (
                          <div key={key} className="custom-control custom-checkbox mt-2 mb-3">
                            <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.searchCheck(s.cat_id)} onChange={e=>this.toggleSearchCheck(s.cat_id)} />
                            <label className="custom-control-label" onClick={e=>this.toggleSearchCheck(s.cat_id)}>{s.cat_name}</label>
                          </div>
                        ))}

                      </React.Fragment>
                  }

                  <br/>
                  <div>
                    {ads1 && <img src={APP_URL + ads1} />}
                  </div>
                  <br/>
                </div>

              </div>

              { !this.state.searchPage &&
                  <div className="col-md-10 col-sm-8 product-content-right">
                    {ads2 && <img src={APP_URL + ads2} className="img-fluid" />}

                    <div className="product-breadcrumb">
                      <span>
                        <Link to ={"/main"} className="text-black">
                          All Categories
                        </Link>
                      </span>
                      {this.productStore.path.map((p, i) => (
                        <span key={i}>
                          { i != 0 && <span><span> &gt; </span> <Link to={p[1]} className={(p[1] === id ? 'text-bold text-violet' : 'text-black')}>{p[0]}</Link></span>}
                        </span>
                      ))}
                    </div>

                    { mainDisplay.map((p, i) => (
                      <ProductList key={i} display={p} mode={this.state.categoryTypeMode} />
                    )
                    )}


                  </div> }

                  { this.state.searchPage &&
                      <div className="col-md-10 col-sm-8 product-content-right">
                        {ads2 && <img src={APP_URL + ads2} className="img-fluid" />}

                        <div className="product-breadcrumb">
                          <div className="search-term">Search: <span className="text-violet">"{this.state.searchTerms}"</span></div>
                          <h3 className="text-italic">"{this.state.searchTerms}"</h3>
                          <span className="search-count">{this.state.searchDisplayed.length} search result(s) for "{this.state.searchTerms}" 
                            {this.state.searchFilter.length > 0 ? <React.Fragment> in {this.state.currentSearchCat}</React.Fragment>: <React.Fragment> in All Categories </React.Fragment>}
                          </span>
                          <hr/>
                        </div>

                        <div className="row">
                          { this.state.searchDisplayed.map((p, i) => (
                            <Product key={i} product={p} />
                          ))}
                        </div>

                      </div> }
                    </div>
                  </div>
                </div>
                { this.productStore.open && <ProductModal/> }
                <DeliveryModal onChangeSubmit={this.handleChangeDelivery}/>
                <DeliveryChangeModal onChangeSubmit={this.handleChangeDelivery}/>
                <button className="btn-cart-mobile btn d-md-none" type="button" onClick={e=>this.uiStore.toggleCartMobile(true)}><span>{cartItems.length}</span>View Order</button>
                <div className={cartMobileClass}>
                  <button className="btn-close-cart btn-transparent" type="button" onClick={e=>this.uiStore.toggleCartMobile(false)}><span className="navbar-toggler-icon close-icon"></span></button> 
                  {cartItems.length>0 ?
                      <React.Fragment>
                        <h2 className="ml-4">Order</h2>
                        <div className="tbl-cart-mobile">
                          <table>
                            <tbody>
                              { cartItems.map((c, i) => (
                                <tr key={i}>
                                  <td style={{width:42}}>{c.customer_quantity}</td>
                                  <td>{c.product_name}<br/><span>{c.packaging_name}</span></td>
                                  <td style={{width:46, color: '#e07f82'}}>{formatMoney(c.total/100)}</td>
                                  <td style={{width: 10}} onClick={e => this.handleDeleteMobile({product_id: c.product_id, inventory_id: c._id})}>
                                    <button className="btn-close-cart btn-transparent" type="button"><span className="navbar-toggler-icon close-icon-grey"></span></button> 
                                  </td>
                                </tr>

                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button className="btn btn-main active btn-checkout-mobile" onClick={e=>this.handleCheckoutMobile(e)}>Checkout</button>

                      </React.Fragment>
                      :
                      <h5 className="text-center">No items in cart</h5>
                  }
                </div>


                <div className={categoryMobileClass}>
                  <div className="row">
                    <div className="col-2">
                      <button className="btn-close-cart btn-transparent" type="button" onClick={e=>this.uiStore.toggleCategoryMobile()}><span className="navbar-toggler-icon close-icon"></span></button> 
                    </div>
                    <div className="col-10">
                      <div className="input-group search-product" style={{width: '90%', marginTop: 15}}>
                        <div className="input-group-prepend">
                          <div className="input-group-text" style={{backgroundColor: '#ececec'}}>
                            <i className="fa fa-search"></i>
                          </div>
                        </div>
                        <input className="rbt-input-main form-control rbt-input" style={{backgroundColor: '#ececec'}} onKeyDown={e => this.handleSearchMobile(e)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <ul className="category-mobile-wrap">
                        {this.state.sidebar.map((s,i) => {

                          let parentSidebarClass = ''
                          let link = '/main/'

                          if (id === s.cat_id) {
                            parentSidebarClass = 'text-violet'
                          }
                          link += s.cat_id

                          // if (typeof id === 'undefined' && !s.cat_id) {
                          //   parentSidebarClass = 'text-violet'
                          //   link = '/main'
                          // }

                          return (
                            <li key={i}>
                              <div>
                                <Link to={link} className={parentSidebarClass} onClick={e=>this.uiStore.toggleCategoryMobile()} replace>{s.cat_name}</Link>
                              </div>
                              <ul>  
                                {s.sub_cats && s.sub_cats.map((sc, idx) => (
                                  <li key={idx}><Link to={"/main/" + (sc.cat_id ? sc.cat_id: '')} 
                                      className={id === sc.cat_id ? "text-violet": ""}
                                    >{sc.cat_name}</Link></li>
                                ) )}
                              </ul>
                            </li>
                          )
                        })}
                      </ul>

                    </div>
                  </div>
                </div>

              </div>
    );
  }
}

export default connect("store")(Mainpage);
