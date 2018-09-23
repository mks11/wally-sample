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

import ProductModal from '../common/ProductModal';

const banner1 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/Banner1.png'
const banner2 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/Banner2.png'
const banner3 = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/Banner3.png'
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
 


let Product = ((props) => {

  if (!props.product) {
    return
  }
  //console.log('props', props.product.product_price)
  let price = props.product.product_price/100
  let price_unit = props.product.product_size

  let unit = 1
  if (price_unit) {
    unit = parseFloat(price_unit.split(' ')[0])
  } else {
    price_unit = unit + ' ' + props.product.unit_type
  }

  if (props.product.unit_type === 'unit') {
    price_unit = ''
  }

  // price *= unit

  return ( <div className="col-6 col-lg-3 col-md-4 col-sm-6 product-thumbnail" onClick={e => props.store.product.showModal(props.product.product_id)}>
    <img src={PRODUCT_BASE_URL + props.product.product_id + "/" + props.product.image_refs[0]} />
    <div className="row product-detail">
      <div className="col-6 product-price">
        {formatMoney(price)}
      </div>
      <div className="col-6 product-weight">
        {price_unit}
      </div>
    </div>
    { props.product.product_name && <span className="product-desc">{props.product.product_name}</span>}
    { props.product.name && <span className="product-desc">{props.product.name}</span>}
  </div>
  )
})

Product = connect("store")(Product)

const ProductList = ({display}) => (
  <div className="product">
    <h2>{display.cat_name}</h2>
    <div className="product-sub">
      <h5>{display.cat_name}</h5>
      <Link to={"/main/" + display.cat_id }>View All {display.number_products} ></Link>
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
    this.modalStore = this.props.store.modal
    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.userStore = this.props.store.user


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
    }

    this.id = null
    this.categoryType = 'all'

    if (!this.id || this.id.length <= 3) {
      this.categoryType = 'limit'
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSelected = this.handleSelected.bind(this)

  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        this.loadData()
      })
    const $ = window.$

    const self = this

    $(window).bind('scroll', function () {
      // console.log($(window).scrollTop())
      if ($(window).scrollTop() > 580) {
        $('.product-top').addClass('fixed');
        self.uiStore.topBar = false
      } else {
        $('.product-top').removeClass('fixed');
        self.uiStore.topBar = true
      }

      if ($(window).scrollTop() > 650) {
        $('.product-content-left').addClass('fixed')
      } else {
        $('.product-content-left').removeClass('fixed')
      }

        
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

    this.checkoutStore.getCurrentCart(this.userStore.getHeaderAuth()).catch((e) => {
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
      this.modalStore.toggleLogin()
    }
  }

  handleEdit(data) {
    this.productStore.showModal(data.product_id, data.customer_quantity)
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

  
  handleCartDropdown = () => {
    this.uiStore.toggleCartDropdown()
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
    
      console.log('asdf', data.get())

    return display
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

    let cartDropdownClass = 'dropdown-menu dropdown-menu-right'
    if (this.uiStore.cartDropdown) {
      cartDropdownClass += ' show'
    }

    let buttonCart = 'product-cart-counter'
    if (cartItems.length>0) {
      buttonCart += ' active'
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
              <div className="col-md-2 col-sm-4 left-column d-none d-md-block">
                <div className="dropdown dropdown-fwidth">

                  <ClickOutside onClickOutside={e => this.uiStore.hideCategoriesDropdown()} >
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

                <div className="d-md-none col-sm-12">
                  <div className="row">
                    <div className="col-10">
                      <h3>Categories</h3>
                    </div>

                    <div className="col-2">
                      <button className="btn btn-transparent" onClick={e=>this.uiStore.toggleCategoryMobile()}><span className="catsearch-icon"></span></button>
                    </div>
                  </div>
                </div>
              <div className="col-md-10 col-sm-8 right-column d-none d-md-block">
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

                  <ClickOutside onClickOutside={e => this.uiStore.hideCartDropdown()}>
                    <div className="btn-group dropdown-cart d-none d-md-block">
                      <div onMouseEnter={this.handleCartDropdown}  className={buttonCart}>
                        <i className="fa fa-shopping-bag"></i><span><strong>{cartCount} {cartCount > 1 ? 'Items' : 'Item'}</strong></span>
                      </div>

                      <div className={cartDropdownClass} aria-labelledby="dropdownMenuButton">
                        { (cartItems && cartItems.length > 0) ?
                            <div>
                        <h3>Orders:</h3>
                        <div className="order-summary">
                          <div className="order-scroll">
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
                          <div className="item-total mt-4">
                            <span>Total</span>
                            <span>{formatMoney(cartSubtotal)}</span>
                          </div>
                        </div>
                        <button onClick={e => this.handleCheckout()} className="btn btn-main active">CHECKOUT</button>
                      </div>
                            : 
                            <span>No items in cart</span>
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
                          {s.sub_cats && s.sub_cats.map((sc, idx) => (
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
                    <ProductList key={i} display={p} />
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
        <button className="btn-cart-mobile btn d-md-none" type="button" onClick={e=>this.uiStore.toggleCartMobile()}><span>{cartItems.length}</span>View Order</button>
        <div className={cartMobileClass}>
          <button className="btn-close-cart btn-transparent" type="button" onClick={e=>this.uiStore.toggleCartMobile()}><span className="navbar-toggler-icon close-icon"></span></button> 
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
