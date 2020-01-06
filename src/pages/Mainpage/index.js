import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { formatMoney, connect, logEvent, logModalView, datesEqual } from 'utils'
import { Link } from 'react-router-dom'
import { APP_URL } from 'config'

import DeliveryModal from 'common/DeliveryModal'
import DeliveryChangeModal from 'common/DeliveryChangeModal'
import AddonFirstModal from 'common/AddonFirstModal'
import CarbonBar from 'common/CarbonBar'

// import Hero from './Hero'
import Product from './Product'
import ProductList from './ProductList'
import ProductTop from './ProductTop'
import MobileSearch from './MobileSearch'
import MobileCartBtn from './MobileCartBtn'
import CategoryCard from './CategoryCard'
import ProductWithPackaging from "../ProductWithPackaging";

class Mainpage extends Component {

  constructor(props){
    super(props)

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.routing = this.props.store.routing
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.zipStore = this.props.store.zip

    this.state = {
      deliveryTimes: this.checkoutStore.deliveryTimes,
      sidebar:[],
      categoryTypeMode: 'limit',
      showMobileSearch: false,
      filters: [],
      sortType: null,
    }

    this.id = this.props.match.params.id
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus(true)
      .then((status) => {
        this.userStore.giftCardPromo && this.processGiftCardPromo(status)
        this.checkoutStore.getDeliveryTimes()
        this.loadData()

        const { mainFirst } = this.userStore.flags || {}
        !mainFirst && this.modalStore.toggleModal('mainFirst')
      })
  }

  loadData() {
    const id = this.props.match.params.id
    this.id = id

    if (this.id === 'buyagain') {
      this.productStore.getHistoricalProducts()
        .catch((e) => console.error('Failed to load historical products: ', e))
    } else {
      let categoryTypeMode = 'all'
      // if (!this.id) {
      //   categoryTypeMode = 'limit'
      // }

      this.setState({categoryTypeMode})

      const deliveryData = this.userStore.getDeliveryParams()

      this.productStore.getAdvertisements()
      this.productStore.getCategories()
      this.productStore.getProductDisplayed(id, deliveryData, this.userStore.getHeaderAuth())
        .then((data) => {
          this.userStore.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)
          this.setState({sidebar: this.productStore.sidebar})
        }).catch((e) => console.error('Failed to load product displayed: ', e))

      this.checkoutStore.getCurrentCart(this.userStore.getHeaderAuth(), deliveryData).then((data) => {
        if (!datesEqual(data.delivery_date, deliveryData.date) && deliveryData.date !== null) {
          this.checkoutStore.getDeliveryTimes().then(() => {
            if (!this.userStore.status || (this.userStore.status && !this.userStore.user.is_ecomm)) {
              this.modalStore.toggleDelivery()
            }
          })
        }

        data && this.userStore.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)



        if (this.userStore.cameFromCartUrl) {
          if (!this.userStore.status || (this.userStore.status && !this.userStore.user.is_ecomm)) {
            const delivery = this.userStore.getDeliveryParams()
            if (delivery.zip && delivery.date) {
              this.checkoutStore.updateCartItems(delivery)
              this.userStore.cameFromCartUrl = false
            } else {
              if (!this.userStore.status || (this.userStore.status && !this.userStore.user.is_ecomm)) {
                this.modalStore.toggleDelivery()
              }
            }
          }
        }
      }).catch((e) => {
        console.error('Failed to load current cart', e)
      })
    }
  }

  processGiftCardPromo(userStatus) {
    if (userStatus) {
      this.checkoutStore.checkPromo({ promoCode: this.userStore.giftCardPromo }, this.userStore.getHeaderAuth())
      .then((data) => {
        let msg = ''
        if (data.valid) {
          msg = 'Store Credit Redeemed'
          this.userStore.getUser().then(() => {
            this.loadData()
          })
        } else {
          msg = 'Invalid Promo-code'
        }
        this.modalStore.toggleModal('referralresult', msg)
        this.userStore.giftCardPromo = null
      })
      .catch((e) => {
        const msg = !e.response.data.error ? 'Check Promo failed' : e.response.data.error.message
        this.modalStore.toggleModal('referralresult', msg)
        this.userStore.giftCardPromo = null
      })
    } else {
      this.modalStore.toggleModal('login')
    }
  }

  componentDidUpdate() {
    const id = this.props.match.params.id
    if (this.id !== id) {
      this.loadData()
    }
  }

  handleCheckoutMobile() {
    logEvent({ category: "Cart", action: "ClickCheckoutMobile" })
    if (this.userStore.status) {
      if (!this.userStore.user.is_ecomm && !this.userStore.selectedDeliveryTime) {
        this.modalStore.toggleDelivery()
      } else {
        this.uiStore.toggleCartMobile(false)
        this.routing.push('/checkout')
      }
    } else {
      this.uiStore.toggleCartMobile(false)
      this.modalStore.toggleModal('login')
    }
  }

  handleDeleteMobile(id) {
    logEvent({category: "Cart", action: "ClickDeleteProductMobile"})
    this.uiStore.toggleCartMobile()
    this.modalStore.toggleModal('delete', id)
  }

  toggleSearchCheck(id) {
    this.productStore.searchCategory(id)
  }

  searchCheck(id) {
    return this.productStore.currentSearchFilter.indexOf(id) !== -1
  }

  toggleSearchAll = () => {
    this.productStore.searchAll()
  }

  handleChangeDelivery = () => {
    if (this.userStore.cameFromCartUrl) {
      const delivery = this.userStore.getDeliveryParams()
      if (delivery.zip && delivery.date) {
        this.checkoutStore.updateCartItems(delivery)
        this.userStore.cameFromCartUrl = false
      }
    }

    this.loadData()
    this.checkoutStore.getDeliveryTimes()
  }

  handleOpenCartMobile = () => {
    logModalView('/cart-mobile')
    this.uiStore.toggleCartMobile(true)
  }

  handleProductModal = (product_id, deliveryTimes) => {
    if (!this.userStore.status || (this.userStore.status && !this.userStore.user.is_ecomm)) {
      if (!this.userStore.selectedDeliveryTime) {
        logModalView('/delivery-options-window')
        this.modalStore.toggleDelivery()
        this.productStore.activeProductId = product_id
      } else {
        this.productStore.showModal(product_id, null, this.userStore.getDeliveryParams())
          .then((data) => {
            this.userStore.adjustDeliveryTimes(data.delivery_date, deliveryTimes)
            this.modalStore.toggleModal('product')
        })
      }
    } else {
      this.productStore.showModal(product_id, null, this.userStore.getDeliveryParams())
        .then((data) => {
          this.userStore.adjustDeliveryTimes(data.delivery_date, deliveryTimes)
          this.modalStore.toggleModal('product')
      })
    }
  }

  handleSearch = keyword => {
    this.uiStore.hideBackdrop()

    if (!keyword.length) {
      this.productStore.resetSearch()
      return
    }
    logEvent({ category: "Search", action: "SearchKeyword", label: keyword })
    this.productStore.searchKeyword(keyword, this.userStore.getDeliveryParams(), this.userStore.getHeaderAuth())
  }

  handleMobileSearchClose = () => {
    this.setState({ showMobileSearch: false })
  }

  handleMobileSearchOpen = () => {
    this.setState({ showMobileSearch: true })
  }

  handleMobileSearch = e => {
    if (e.keyCode === 13) {
      this.setState({ showMobileSearch: false })
      this.handleSearch(e.target.value)
    }
  }

  handleCategoryClick = () => {
    this.setState({ showMobileSearch: false })
    this.productStore.resetSearch()
  }

  handleFilterUpdate = filters => {
    this.setState({ filters })
  }

  handleSort = type => {
    this.setState({ sortType: type })
  }

  sortByType = (a, b) => {
    switch(this.state.sortType) {
      case 'times_bought':
        return a.times_bought - b.times_bought
      case 'last_ordered':
        return a.last_ordered - b.last_ordered
      case 'by_name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  }

  render() {
    const {
      showMobileSearch,
      sidebar,
      filters,
    } = this.state

    const id = this.props.match.params.id
    const cartItems = this.checkoutStore.cart ? this.checkoutStore.cart.cart_items : []
    const ads1 = this.productStore.ads1 ? this.productStore.ads1 : null
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 : null

    const categoryLink =
      this.productStore.currentSearchCategory === 'All Categories'
        ? <Link to="/main" onClick={this.handleCategoryClick}>{this.productStore.currentSearchCategory}</Link>
        : this.productStore.currentSearchCategory


    return (
      <div className="App">
        <ProductTop
          onMobileSearchClick={this.handleMobileSearchOpen}
          onSearch={this.handleSearch}
          onCategoryClick={this.handleCategoryClick}
          onFilterUpdate={this.handleFilterUpdate}
        />

      <div className="product-content">
        <div className="container">
          <div className="row ">
            <div className="col-md-2 col-sm-4">
                <div className="product-content-left">
                  <div className="mb-4">
                    <h4>The Wally Shop</h4>
                  </div>
                    {
                      sidebar.map((s,i) => {
                        return (
                          <div className="mb-0" key={i}>
                            <h4><Link to={`/main/${s.cat_id}`} className={`${id === s.cat_id ? '' : ''}`} replace>{s.cat_name}</Link></h4>
                            <ul>
                              {s.subcats && s.subcats.map((sc, idx) => (
                                <li key={idx}><Link to={`/main/${sc.cat_id || ''}`}
                                    className={id === sc.cat_id ? "text-violet": ""}
                                  >{sc.cat_name}</Link></li>
                              ) )}
                            </ul>
                          </div>
                        )
                      })
                    }

                    <br/>
                    <div>
                      {ads1 && <img src={APP_URL + ads1.image} alt="" />}
                    </div>
                    <br/>
                  </div>

                </div>

              {
                this.id === 'buyagain' && !this.productStore.search.state ? (
                      <div className="col-md-10 col-sm-8">
                        <div className="product-content-right">

                          <div className="product-breadcrumb">
                            <CarbonBar
                              value={cartItems.length % 10 === 0 ? (!cartItems.length ? 0 : 10) : cartItems.length % 10}
                            />
                            <div className="filters">
                              <div className="filters-title">Sort:</div>
                              <div className="filters-values as-sort">
                                <ul>
                                  <li onClick={() => this.handleSort('times_bought')}>Most Bought</li>
                                  <li onClick={() => this.handleSort('last_ordered')}>Recently Ordered</li>
                                  <li onClick={() => this.handleSort('by_name')}>A-Z</li>
                                </ul>
                              </div>
                            </div>
                            <hr/>
                          </div>

                          <div className="row">

                            {
                              this.productStore.historical_products.length
                                ? this.productStore.historical_products
                                    .sort((a, b) => this.sortByType(a, b))
                                    .map((product, index) => (
                                    <Product
                                      key={index}
                                      product={product}
                                      deliveryTimes={this.state.deliveryTimes}
                                      onProductClick={this.handleProductModal}
                                    />
                                  ))
                                : <h2>No Orders Yet</h2>
                            }
                          </div>
                        </div>
                      </div>
                ) : null
              }

              {
                this.productStore.search.state
                  ? (
                      <div className="col-md-10 col-sm-8">
                        <div className="product-content-right">
                          {ads2 && <img src={APP_URL + ads2} className="img-fluid" alt="" />}

                          <div className="product-breadcrumb">
                            <CarbonBar
                              value={cartItems.length % 10 === 0 ? (!cartItems.length ? 0 : 10) : cartItems.length % 10}
                            />
                            <hr/>
                          </div>

                          <div className="row">
                            {
                              this.productStore.search.display
                                .filter(p => filters.length ? filters.some(f => {
                                  if (p.allergens && p.tags) {
                                    return !p.allergens.includes(f) && !p.tags.includes(f)
                                  }
                                  return true
                                }) : true)
                                .map((product, index) => (
                                <Product
                                  key={index}
                                  product={product}
                                  deliveryTimes={this.state.deliveryTimes}
                                  onProductClick={this.handleProductModal}
                                />
                              ))
                            }
                          </div>
                        </div>
                      </div>
                  ) : (
                    this.id !== 'buyagain' && (
                      <div className="col-md-10 col-sm-8">
                        <div className="product-content-right">
                          { this.props.location.pathname.split('/')[1] === 'packaging' ?
                            <ProductWithPackaging packagingId={this.props.match.params.id}/>
                            : <React.Fragment>
                          {ads2 && <img src={APP_URL + ads2.image} className="img-fluid" alt="" />}

                          <div className="product-breadcrumb">
                            <CarbonBar
                              value={cartItems.length % 10 === 0 ? (!cartItems.length ? 0 : 10) : cartItems.length % 10}
                            />
                          </div>

                          {
                            this.state.categoryTypeMode === 'limit'
                              ? (
                                <div className="row">
                                {
                                  this.productStore.main_display.map((category, index) => (
                                    <CategoryCard
                                      key={index}
                                      category={category}
                                    />
                                  ))
                                }
                                </div>
                              )
                              : (
                                  this.productStore.main_display.map((category, index) => (
                                    <ProductList
                                      key={index}
                                      display={category}
                                      filters={filters}
                                      mode={this.state.categoryTypeMode}
                                      deliveryTimes={this.state.deliveryTimes}
                                      onProductClick={this.handleProductModal}
                                    />
                                  ))
                              )
                          }
                          </React.Fragment>}
                        </div>
                      </div>
                      )

                    )
                  }
                    </div>
                  </div>
                </div>
                <DeliveryModal onChangeSubmit={this.handleChangeDelivery} />
                <DeliveryChangeModal onChangeSubmit={this.handleChangeDelivery}/>
                <MobileCartBtn
                  onClick={this.handleOpenCartMobile}
                  items={cartItems.length}
                />
                <div className={`cart-mobile d-md-none ${this.uiStore.cartMobile ? 'open' : ''}`}>
                  <button className="btn-close-cart btn-transparent" type="button" onClick={e=>this.uiStore.toggleCartMobile(false)}><span className="navbar-toggler-icon close-icon"></span></button>
                  {cartItems.length>0 ?
                      <React.Fragment>
                        <h2 className="ml-4 mb-2">Order</h2>
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

                <MobileSearch
                  show={showMobileSearch}
                  onClose={this.handleMobileSearchClose}
                  onSearch={this.handleMobileSearch}
                  onCategoryClick={this.handleCategoryClick}
                  sidebar={sidebar}
                  id={id}
                />

                <AddonFirstModal />

              </div>
    );
  }
}

export default connect("store")(Mainpage);
