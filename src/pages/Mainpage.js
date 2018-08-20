import React, { Component } from 'react';
import Title from '../common/page/Title'
import { formatMoney, connect } from '../utils'
import { Link } from 'react-router-dom'
import { APP_URL } from '../config'
import {MenuItem, MenuItemContainer, AsyncTypeahead} from 'react-bootstrap-typeahead'
 

import ProductModal from '../common/ProductModal';

let Product = ((props) => ( 
  <div className="col-lg-3 col-md-4 col-sm-6 product-thumbnail" onClick={e => props.store.product.showModal(props.product.product_id)}>
    <img src={APP_URL + "/images/product_thumbnail.png"} />
    <div className="row product-detail">
      <div className="col-6 product-price">
        {formatMoney(props.product.product_price)}
      </div>
      <div className="col-6 product-weight">
        {(props.product.product_size)}
      </div>
    </div>
    <span className="product-desc">{props.product.product_name}</span>
  </div>
))

Product = connect("store")(Product)

const ProductList = ({display}) => (
  <div className="product">
    <h2>{display.cat_name}</h2>
    <div className="product-sub">
      <h5>{display.cat_name}</h5>
      <Link to={"/main/" + display.cat_id }>View All 27 ></Link>
    </div>

    <div className="row">
      { display.products.map((p, i) => (
        <Product key={i} product={p} />
      ))}
    </div>
  </div>
)

class Mainpage extends Component {

  constructor(props){
    super(props)

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.routing = this.props.store.routing
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout


    this.state = {
      searchAhead: [],
      searchAheadLoading: false,
      searchPage: false,
      searchResult:null,
      searchTerms: '',

      sidebar:[],
    }

    this.id = null

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSelected = this.handleSelected.bind(this)

  }

  componentDidMount() {
    this.loadData()
    this.userStore.getStatus()
      .then((status) => {
      })
  }

  loadData() {
    const id = this.props.match.params.id
    this.id = id
    this.productStore.getAdvertisements()
    this.productStore.getCategories()
    this.productStore.getProductDisplayed(id).then((data) => {
      this.setState({sidebar: this.productStore.sidebar})
    }).catch((e) => console.error('Failed to load product displayed: ', e))

    this.checkoutStore.getCurrentCart()
  }


  componentDidUpdate() {
    const id = this.props.match.params.id
    if (this.id !== id) {
      this.loadData()
    }
  }

  handleCheckout() {
    this.uiStore.toggleCartDropdown()
    this.routing.push('/checkout')
  }

  handleEdit(id) {
    this.productStore.showModal(id)
  }

  handleDelete(id) {
    this.checkoutStore.toggleDeleteModal(id)
  }

  handleSearch(keyword) {
    this.setState({searchAheadLoading: true})
    this.productStore.searchKeyword(keyword).then((data) => {
      this.setState({searchAhead: data.products, searchAheadLoading: false, searchResult: data})
    })
  }

  search(keyword) {
    this.uiStore.hideBackdrop()

    const instance = this._typeahead.getInstance();
    instance.blur();

    this.productStore.searchKeyword(keyword).then((data) => {
      let filters = []
      filters = data && data.filters ?
        data.filters : []
      this.setState({sidebar: filters, searchAheadLoading: false, searchResult: data, searchPage: true, searchTerms: keyword})
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

  handleCartDropdown() {
    if (this.checkoutStore.cart && this.checkoutStore.cart.cart_items.length > 0) {
      this.uiStore.toggleCartDropdown()
    }
  }

  render() {
    if (this.productStore.fetch) {
      return null
    }

    const id = this.props.match.params.id

    let cartDropdownClass = 'dropdown-menu dropdown-menu-right'
    let buttonCart = 'product-cart-counter'
    if (this.uiStore.cartDropdown) {
      cartDropdownClass += ' show'
      buttonCart += ' active'
    }

    let categoriesDropdownClass = 'dropdown-menu dropdown-menu-right'
    if (this.uiStore.categoriesDropdown) {
      categoriesDropdownClass += ' show'
    }

    let cartCount = 0, cartItems = [], cartSubtotal = 0

    if (this.checkoutStore.cart) {
      const cart_items = this.checkoutStore.cart.cart_items
      cartCount = cart_items.length
      cartItems = cart_items
      cartSubtotal = this.checkoutStore.cart.subtotal
    }


    return (
      <div className="App">

        {/* Product Top */}
        <div className="product-top">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-4 left-column">
                <div className="dropdown dropdown-fwidth">
                  <h3 onClick={e => this.uiStore.toggleCategoriesDropdown()}>All Categories <i className="fa fa-chevron-down"></i></h3>

                  <div className={categoriesDropdownClass} aria-labelledby="dropdownMenuButton">
                    <Link to="/main" className="dropdown-item">All Categories</Link>

                    {this.productStore.categories.map((s,i) => (
                      <Link to={"/main/"+ (s.cat_id ? s.cat_id:'')} className="dropdown-item" key={i}>{s.cat_name}</Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-9 col-sm-8 right-column">
                <div className="media">
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

                    <div className="btn-group dropdown-cart">
                      <div onClick={e => this.handleCartDropdown()} className={buttonCart}>
                        <i className="fa fa-shopping-bag"></i><span>{cartCount} Item</span>
                      </div>

                      <div className={cartDropdownClass} aria-labelledby="dropdownMenuButton">
                        <h3>Orders:</h3>
                        <div className="order-summary">
                          <div className="order-scroll">
                            { cartItems.map((c, i) => (
                            <div className="item mt-3 pb-2" key={i}>
                              <div className="item-left">
                                <h4 className="item-name">{c.product_name}</h4>
                                <span className="item-detail mb-1">2 oz, container large</span>
                                <div className="item-link">
                                  <a className="text-blue mr-2" onClick={e => this.handleEdit(c.product_id)}>EDIT</a>
                                  <a className="text-dark-grey" onClick={e => this.handleDelete(c.product_id)}>DELETE</a>
                                </div>
                              </div>
                              <div className="item-right">
                                <h4>x1</h4>
                                <span className="item-price">{formatMoney(c.product_price)}</span>
                              </div>
                            </div>

                            ))}
                          </div>
                          <div className="item-total mt-4">
                            <span>Total</span>
                            <span>{formatMoney(cartSubtotal)}</span>
                          </div>
                        </div>
                        <button onClick={e => this.handleCheckout()} className="btn btn-main active">CHECKOUT</button>
                      </div>
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
              <div className="col-md-3 col-sm-4">
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

                  {this.state.sidebar.map((s,i) => {

                    let parentSidebarClass = ''
                    let link = '/main'

                    if (id === s.cat_id) {
                      parentSidebarClass = 'text-violet'
                      link += s.cat_id
                    }

                    if (typeof id === 'undefined' && !s.cat_id) {
                      parentSidebarClass = 'text-violet'
                      link = '/main'
                    }

                    return (
                      <div className="mb-4" key={i}>
                        <h4><Link to={link} className={parentSidebarClass} replace>{s.cat_name}</Link></h4>
                        <ul>  
                          {s.sub_cats.map((sc, idx) => (
                            <li key={idx}><Link to={"/main/" + (sc.cat_id ? sc.cat_id: '')} 
                                className={id === sc.cat_id ? "text-violet": ""}
                              >{sc.cat_name}</Link></li>
                          ) )}
                        </ul>
                      </div>
                    )
                  })}

                  <div>
                    <img src={APP_URL + this.productStore.ads1} />
                  </div>
                </div>

              </div>

              { !this.state.searchPage &&
              <div className="col-md-9 col-sm-8 product-content-right">
                <img src={APP_URL + this.productStore.ads2} className="img-fluid" />

                <div className="product-breadcrumb">
                  <span>All Categories > </span>
                  {this.productStore.path.map((p, i) => (
                    <span key={i}>
                    { i != 0 && <a className="text-violet text-bold" href="">{p}</a>}
                    </span>
                  ))}
                </div>

                { this.productStore.main_display.map((p, i) => (
                  <ProductList key={i} display={p} />
                ))}

                
              </div> }

              { this.state.searchPage &&
              <div className="col-md-9 col-sm-8 product-content-right">
                <img src={APP_URL + this.productStore.ads2} className="img-fluid" />

                <div className="product-breadcrumb">
                  <div className="search-term">Search: <span className="text-violet">"{this.state.searchTerms}"</span></div>
                  <h3 className="text-italic">"{this.state.searchTerms}"</h3>
                  <span className="search-count">{this.state.searchResult.products.length} search result for "{this.state.searchTerms}" in Fresh Produce</span>
                  <hr/>
                </div>

                { this.state.searchResult.products.map((p, i) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 product-thumbnail" onClick={e => this.productStore.showModal(p.product_id)}>
                    <img src={APP_URL + "/images/product_thumbnail.png"} />
                    <div className="row product-detail">
                      <div className="col-6 product-price">
                        $2.99
                      </div>
                      <div className="col-6 product-weight">
                        12 oz
                      </div>
                    </div>
                    <span className="product-desc">{p.name}</span>
                  </div>
                ))}

                
              </div> }
            </div>
          </div>
        </div>
        { this.productStore.open && <ProductModal/> }
    
      </div>
    );
  }
}

export default connect("store")(Mainpage);
