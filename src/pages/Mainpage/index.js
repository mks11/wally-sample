import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { formatMoney, connect, logEvent, logModalView, datesEqual } from 'utils'
import { Link } from 'react-router-dom'
import { APP_URL } from 'config'

import DeliveryModal from 'common/DeliveryModal.js';
import DeliveryChangeModal from 'common/DeliveryChangeModal.js';
import ProductModal from 'common/ProductModal';

import Hero from './Hero'
import Product from './Product'
import ProductList from './ProductList'
import ProductTop from './ProductTop'
import MobileSearch from './MobileSearch'

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
      searchPage: false,
      searchResult:[],
      searchDisplayed:[],
      searchTerms: '',
      searchFilter: [],
      searchAll: true,

      sidebar:[],
      searchSidebar:[],

      currentSearchCat: null,
      currentSearchCatId: null,

      categoryTypeMode: 'limit',

      showMobileSearch: false,
    }

    this.id = this.props.match.params.id
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus(true)
      .then((status) => {
        this.userStore.giftCardPromo && this.processGiftCardPromo(status)
        
        const selectedAddress = this.userStore.selectedDeliveryAddress
          || (this.userStore.user
            ? this.userStore.getAddressById(this.userStore.user.preferred_address)
            : null)

        this.checkoutStore.getDeliveryTimes(selectedAddress).then((data) => {
          const deliveryTimes = this.checkoutStore.transformDeliveryTimes(data)
          this.setState({deliveryTimes})
        })
        this.loadData(status)
      })
  }

  loadData(userStatus) {
    const id = this.props.match.params.id
    this.id = id

    let categoryTypeMode = 'all'

    if (!this.id || this.id.length <= 3) {
      categoryTypeMode = 'limit'
    }

    this.setState({categoryTypeMode})

    const deliveryData = this.userStore.getDeliveryParams()

    this.productStore.getAdvertisements()
    this.productStore.getCategories()
    this.productStore.getProductDisplayed(id, deliveryData).then((data) => {
      this.userStore.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)
      this.setState({sidebar: this.productStore.sidebar})
    }).catch((e) => console.error('Failed to load product displayed: ', e))

    this.checkoutStore.getCurrentCart(this.userStore.getHeaderAuth(), deliveryData).then((data) => {
      if (!datesEqual(data.delivery_date, deliveryData.date) && deliveryData.date !== null) {
        this.checkoutStore.getDeliveryTimes().then((data) => {
          const deliveryTimes = this.checkoutStore.transformDeliveryTimes(data)
          this.setState({ deliveryTimes })
          this.userStore.toggleDeliveryModal(true)
        })
      }
      data && this.userStore.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)

      if (this.userStore.cameFromCartUrl) {
        const delivery = this.userStore.getDeliveryParams()
        if (delivery.zip && delivery.date) {
          this.checkoutStore.updateCartItems(delivery)
          this.userStore.cameFromCartUrl = false
        } else {
          userStatus && this.userStore.toggleDeliveryModal(true)
        }
      }
    }).catch((e) => {
      console.error('Failed to load current cart', e)
    })
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
      if (!this.userStore.selectedDeliveryTime) {
        this.userStore.toggleDeliveryModal(true)
      } else {
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

    let curCat = this.state.searchResult.filters.reduce((sum, d) => {
      if (cur.indexOf(d.cat_id) !== -1) {
        sum.push(d.cat_name)
      }
      return sum
    }, [])
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
       const curFilter = this.state.searchResult.filters.map((sum, d) => {
        sum.push(d.cat_id)
        return sum
      }, [])
      this.setState({searchFilter: curFilter, searchDisplayed: this.state.searchResult.products, currentSearchCat: 'All Categories'})
    }
    this.setState({searchAll: !this.state.searchAll})
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
    const address = this.userStore.selectedDeliveryAddress
    this.checkoutStore.getDeliveryTimes(address).then((deliveryTimes) => {
      const times = this.checkoutStore.transformDeliveryTimes(deliveryTimes)
      this.setState({deliveryTimes: times})
    })
  }

  handleAddToCart = (data) => {
    data && this.userStore.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)
  }

  handleOpenCartMobile = () => {
    logModalView('/cart-mobile')
    this.uiStore.toggleCartMobile(true)
  }

  handleProductModal = (product_id, deliveryTimes) => {
    if (/*!this.userStore.selectedDeliveryAddress ||*/ !this.userStore.selectedDeliveryTime) {
      logModalView('/delivery-options-window')
      this.userStore.toggleDeliveryModal(true)
      this.productStore.activeProductId = product_id
    } else {
      this.productStore.showModal(product_id, null, this.userStore.getDeliveryParams())
        .then((data) => {
          this.userStore.adjustDeliveryTimes(data.delivery_date, deliveryTimes)
        })
    }
  }

  handleSearch = keyword => {
    this.uiStore.hideBackdrop()

    if (!keyword.length) {
      this.setState({ searchPage: false })
      return
    }

    this.productStore.searchKeyword(keyword, this.userStore.getDeliveryParams())
      .then(data => {
        const filters = (data && data.filters)
                          ? data.filters
                          : []

        const currentSearchCatId = data.filters.length > 0 ? filters[0].cat_id : null

        const cur = data.filters.reduce((sum, d) => {
          sum.push(d.cat_id)
          return sum
        }, [])

        this.setState({
          searchSidebar: filters, 
          searchFilter: cur,
          searchResult: data,
          searchPage: true,
          searchTerms: keyword,
          currentSearchCatId,
          currentSearchCat: 'All Categories',
          searchDisplayed: data.products
        })
      })
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

  render() {
    const {
      showMobileSearch,
      sidebar,
    } = this.state

    const id = this.props.match.params.id

    let cartMobileClass = 'cart-mobile d-md-none'
    if (this.uiStore.cartMobile) {
      cartMobileClass += ' open'
    }

    let cartCount = 0, cartItems = [], cartSubtotal = 0

    if (this.checkoutStore.cart) {
      const cart_items = this.checkoutStore.cart.cart_items
      cartCount = cart_items.length
      cartItems = cart_items
      cartSubtotal = this.checkoutStore.cart.subtotal / 100
    }

    const mainDisplay = this.productStore.main_display

    const ads1 = this.productStore.ads1 ? this.productStore.ads1 :null
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 :null

    return (
      <div className="App">
        <Hero />
        <ProductTop
          onMobileSearchClick={this.handleMobileSearchOpen}
          onSearch={this.handleSearch}
        />

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

                  {!this.state.searchPage && sidebar.map((s,i) => {

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
                    {ads1 && <img src={APP_URL + ads1} alt="" />}
                  </div>
                  <br/>
                </div>

              </div>

              { !this.state.searchPage &&
                  <div className="col-md-10 col-sm-8">
                    <div className="product-content-right">
                      {ads2 && <img src={APP_URL + ads2} className="img-fluid" alt="" />}

                      <div className="product-breadcrumb">
                        <span>
                          <Link to ={"/main"} className="text-black">
                            All Categories
                          </Link>
                        </span>
                        {this.productStore.path.map((p, i) => (
                          <span key={i}>
                            { i !== 0 && <span><span> &gt; </span> <Link to={p[1]} className={(p[1] === id ? 'text-bold text-violet' : 'text-black')}>{p[0]}</Link></span>}
                          </span>
                        ))}
                      </div>

                      { 
                        mainDisplay.map((product, index) => (
                          <ProductList
                            key={index}
                            display={product}
                            mode={this.state.categoryTypeMode}
                            deliveryTimes={this.state.deliveryTimes}
                            onProductClick={this.handleProductModal}
                          />
                        ))
                      }
                    </div>
                  </div> }

                  { this.state.searchPage &&
                      <div className="col-md-10 col-sm-8">
                        <div className="product-content-right">
                          {ads2 && <img src={APP_URL + ads2} className="img-fluid" alt="" />}

                          <div className="product-breadcrumb">
                            <div className="search-term">Search: <span className="text-violet">"{this.state.searchTerms}"</span></div>
                            <h3 className="text-italic">"{this.state.searchTerms}"</h3>
                            <span className="search-count">{this.state.searchDisplayed.length} search result(s) for "{this.state.searchTerms}" 
                              {this.state.searchFilter.length > 0 ? <React.Fragment> in {this.state.currentSearchCat}</React.Fragment>: <React.Fragment> in All Categories </React.Fragment>}
                            </span>
                            <hr/>
                          </div>

                          <div className="row">
                            { 
                              this.state.searchDisplayed.map((product, index) => (
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
                      </div> }
                    </div>
                  </div>
                </div>
                { this.productStore.open && <ProductModal onAddToCart={this.handleAddToCart}/> }
                <DeliveryModal onChangeSubmit={this.handleChangeDelivery} deliveryTimes={this.state.deliveryTimes}/>
                <DeliveryChangeModal onChangeSubmit={this.handleChangeDelivery}/>
                <button className="btn-cart-mobile btn d-md-none" type="button" onClick={e=>this.handleOpenCartMobile()}><span>{cartItems.length}</span>View Order</button>
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

                <MobileSearch
                  show={showMobileSearch}
                  onClose={this.handleMobileSearchClose}
                  onSearch={this.handleMobileSearch}
                  sidebar={sidebar}
                  id={id}
                />

              </div>
    );
  }
}

export default connect("store")(Mainpage);
