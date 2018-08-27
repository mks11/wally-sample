import React, { Component } from 'react';
import Title from '../common/page/Title'
import { formatMoney, connect } from '../utils'
import { Link } from 'react-router-dom'
import { APP_URL } from '../config'
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

const heroItems = [
  {
    src: APP_URL + '/images/hero1.png',
    altText: 'Slide 1',
    caption: 'Slide 1'
  },
  {
    src: APP_URL + '/images/hero1.png',
    altText: 'Slide 2',
    caption: 'Slide 2'
  },
  {
    src: APP_URL + '/images/hero1.png',
    altText: 'Slide 3',
    caption: 'Slide 3'
  },
  {
    src: APP_URL + '/images/hero1.png',
    altText: 'Slide 4',
    caption: 'Slide 4'
  }
];
 


let Product = ((props) => {
  let price = props.product.product_price/100
  let price_unit = props.product.product_size

  let unit = 1
  if (price_unit) {
    unit = parseFloat(price_unit.split(' ')[0])
  } else {
    price_unit = unit + ' ' + props.product.unit_type
  }

  // price *= unit

  return ( <div className="col-lg-3 col-md-4 col-sm-6 product-thumbnail" onClick={e => props.store.product.showModal(props.product.product_id)}>
    <img src={APP_URL + "/images/product_thumbnail.png"} />
    <div className="row product-detail">
      <div className="col-6 product-price">
        {formatMoney(price)}
      </div>
      <div className="col-6 product-weight">
        {price_unit}
      </div>
    </div>
    <span className="product-desc">{props.product.product_name}</span>
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

      activeHeroIndex: 0,

      sidebar:[],
      searchSidebar:[],

      currentSearchCat: null,
      currentSearchCatId: null,

      cartDropdown: false,
      categoriesDropdown: false,
    }

    this.id = null

    this.handleSearch = this.handleSearch.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSelected = this.handleSelected.bind(this)

  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
      })
    const $ = window.$
    $(window).bind('scroll', function () {
      if ($(window).scrollTop() > 515) {
        $('.product-top').addClass('fixed');
      } else {
        $('.product-top').removeClass('fixed');
      }
    });
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
      this.routing.push('/checkout')
  }

  handleEdit(data) {
    this.productStore.showModal(data.product_id, data.customer_quantity)
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

      const currentSearchCatId = filters[0].cat_id
      const currentSearchCat = filters[0].cat_name
      const searchDisplayed = data.products.filter((d) => {
        return d.cat_id == currentSearchCatId
      })

      this.setState({searchSidebar: filters, searchAheadLoading: false, searchResult: data, searchPage: true, searchTerms: keyword, currentSearchCatId, currentSearchCat, searchDisplayed })
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

    this.setState({searchDisplayed, currentSearchCat: current.cat_name, currentSearchCatId: current.cat_id})


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

  render() {
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
      cartSubtotal = this.checkoutStore.cart.subtotal / 100
    }

    const ads1 = this.productStore.ads1 ? this.productStore.ads1 : '/images/shop_banner_1.png'
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 : '/images/shop_banner_2.png'

    const { activeHeroIndex } = this.state;

    const slides = heroItems.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onHeroExiting}
          onExited={this.onHeroExited}
          key={item.caption}
        >
          <img src={item.src} alt={item.altText} />
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
              <div className="col-md-2 col-sm-4 left-column">
                <div className="dropdown dropdown-fwidth">

                  <ClickOutside onClickOutside={e => this.uiStore.hideCategoriesDropdown()}>
                  <h3 onClick={this.handleCategoriesDropdown}>All Categories <i className="fa fa-chevron-down"></i></h3>

                  <div className={categoriesDropdownClass} aria-labelledby="dropdownMenuButton">
                    <Link to="/main" className="dropdown-item" onClick={e=>this.uiStore.hideCategoriesDropdown()}>All Categories</Link>

                    {this.productStore.categories.map((s,i) => (
                      <React.Fragment key={i}>
                        {(!s.parent_id && s.cat_id.length<=3) && <Link to={"/main/"+ (s.cat_id ? s.cat_id:'')} className="dropdown-item" key={i} onClick={e=> this.uiStore.hideCategoriesDropdown()}>{s.cat_name}</Link>}
                      </React.Fragment>

                    ))}
                  </div>
                </ClickOutside>
                </div>
              </div>
              <div className="col-md-10 col-sm-8 right-column">
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
                    <div className="btn-group dropdown-cart">
                      <div onClick={this.handleCartDropdown} className={buttonCart}>
                        <i className="fa fa-shopping-bag"></i><span>{cartCount} Item</span>
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
                                <span className="item-detail mb-1">2 oz, container large</span>
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
                          {s.sub_cat && s.sub_cats.map((sc, idx) => (
                            <li key={idx}><Link to={"/main/" + (sc.cat_id ? sc.cat_id: '')} 
                                className={id === sc.cat_id ? "text-violet": ""}
                              >{sc.cat_name}</Link></li>
                          ) )}
                        </ul>
                      </div>
                    )
                  })}

                  {this.state.searchPage && <h4>Sub Categories</h4>}
                  {this.state.searchPage && this.state.searchSidebar.map((s,i) => {
                    return (
                      <div key={i}>
                        <label className="form-check-label check-sidebar">
                          <input checked={s.cat_id==this.state.currentSearchCatId} type="radio" name="search_category" class="form-check-input" onChange={e=>this.handleChangeSearchCategory(s.cat_id)}/>
                          <span>{s.cat_name}</span>
                        </label>
                      </div>
                    )
                  })}

                  <br/>
                  <div>
                    <img src={APP_URL + ads1} />
                  </div>
                  <br/>
                </div>

              </div>

              { !this.state.searchPage &&
              <div className="col-md-10 col-sm-8 product-content-right">
                <img src={APP_URL + ads2} className="img-fluid" />

                <div className="product-breadcrumb">
                  <span>
                    <Link to ={"/main"} className="text-violet text-bold">
                      All Categories
                    </Link>
                  </span>
                  {this.productStore.path.map((p, i) => (
                    <span key={i}>
                      { i != 0 && <span><span> &gt; </span> <Link to={p[1]} className="text-violet text-bold">{p[0]}</Link></span>}
                    </span>
                  ))}
                </div>

                { this.productStore.main_display.map((p, i) => (
                  <ProductList key={i} display={p} />
                ))}

                
              </div> }

              { this.state.searchPage &&
              <div className="col-md-10 col-sm-8 product-content-right">
                <img src={APP_URL + ads2} className="img-fluid" />

                <div className="product-breadcrumb">
                  <div className="search-term">Search: <span className="text-violet">"{this.state.searchTerms}"</span></div>
                  <h3 className="text-italic">"{this.state.searchTerms}"</h3>
                  <span className="search-count">{this.state.searchDisplayed.length} search result for "{this.state.searchTerms}" in {this.state.currentSearchCat}</span>
                  <hr/>
                </div>

                <div className="row">
                { this.state.searchDisplayed.map((p, i) => (
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
              </div>
                
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
