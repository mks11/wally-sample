import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
} from 'reactstrap'
import {
  formatMoney,
  logModalView,
  logEvent,
  connect
} from 'utils'
import {
  PRODUCT_BASE_URL,
  NUTRITIONAL_INFO_BASE_URL,
} from 'config'
import AmountGroup from 'common/AmountGroup'

import QuantitySelect from '../../common/QuantitySelect'
import Product from '../../pages/Mainpage/Product/index'
import ProductRatingForm from '../../common/ProductRatingForm'
import ProductRatingStars from '../../common/ProductRatingStars'

class ProductModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qty: 1,
      infoPackage: false,
      slick: false,
      packagingAddon: '',
      quantityAddon: 0,
      outOfStock: false,
      available: true,
      packagingType: null,
      priceMultiplier: 1
    }

    this.productStore = props.store.product
    this.modalStore = props.store.modal
    this.userStore = props.store.user
  }

  componentDidMount() {

    const product = this.productStore
    const modal = this.modalStore
    const user = this.userStore

    this.setState({qty: product.activeProduct.min_size})
    let priceMultiplier = 1
    this.setState({ priceMultiplier: priceMultiplier });

    let packagingType = product.activeProduct.available_inventory[0].packaging_type;
    this.setState({ packagingType: packagingType });

    if (!product.activeProduct) return null

    this.setState({
      outOfStock: product.activeProduct.out_of_stock,
      available: true,
    })
    logModalView('/product/' + product.activeProductId)

    if (product.activeProduct.add_ons && product.activeProduct.add_ons.length) {
      const { addonsFirst } = user.flags || {}
      !addonsFirst && modal.toggleAddonsFirst()
    }
  }

  componentDidUpdate() {
    const { product } = this.props.stores

    if (!this.state.slick) {
      this.setState({slick: true, qty: product.customer_quantity})
      const $thumb = window.$(this.thumb)
      const $prod = window.$(this.prod)
      $prod.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '#thumbnailproduct-carousel',
        dots: false,
        infinite: false,
        arrows: false,
        responsive: [
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false,
              infinite: false,
              arrows: true,
            }
          },
        ],
      });
      $thumb.slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        asNavFor: '#product-carousel',
        dots: false,
        infinite: false,
        variableWidth: true
      });

      $thumb.find('.slick-item').click(function() {
        $prod.slick('slickGoTo', window.$(this).index())
      })
    }
  }

  toggleInfoPackage = () => {
    this.setState({ infoPackage: !this.state.infoPackage })
  }

  handleAddToCart = () => {
    const { product, checkout, user, routing } = this.props.stores
    const { custom, customIsEmpty, quantityAddon, packagingAddon, outOfStock, available } = this.state

    if (outOfStock || !available) return

    if (custom && customIsEmpty) {
      this.setState({
        customError: true,
      })
      return
    }

    logEvent({category:"Product", action:"AddToCart", value:this.state.qty, label:product.activeProductId})
    const activeProduct = product.activeProduct
    const inventory = activeProduct.available_inventory[0] ? activeProduct.available_inventory[0] : null
    const order_summary = routing.location.pathname.indexOf('checkout') !== -1

    const finalUnitType = activeProduct.unit_type

    const items = [
      {
        quantity: this.state.qty,
        product_id: inventory.product_id,
        inventory_id: inventory._id,
        unit_type: finalUnitType,
      }
    ]

    if (quantityAddon > 0) {
      const addonProduct = activeProduct.add_ons.find(p => p.product_id === packagingAddon)

      items.push({
        quantity: quantityAddon,
        product_id: packagingAddon,
        inventory_id: addonProduct.inventory[0]._id,
        unit_type: addonProduct.unit_type
      })
    }

    checkout.editCurrentCart(
    { items },
    user.getHeaderAuth(),
    order_summary,
    user.getDeliveryParams())
      .then(data => {
        data && user.adjustDeliveryTimes(data.delivery_date, this.state.deliveryTimes)
      }).catch((e) => {
        if (e.response) {
          const msg = e.response.data.error.message
          this.setState({invalidText: msg})
          console.error('Failed to add to cart', e)
        }
      })

    this.props.toggle()
  }

  handleSelectQuantity = e => {
    this.setState({ qty: e.target.value })
  }

  handlePackagingAddon = value => {
    this.setState({ packagingAddon: value })
  }

  handleQuantityAddon = value => {
    this.setState({ quantityAddon: value })
  }

  handlePackagingChange = value => {
    const { product } = this.props.stores
    this.setState({ packagingType: value.type })
    let idx = product.activeProduct.packaging_id.map(function(i) { return i.toString(); }).indexOf(value._id);
    let vol = product.activeProduct.packaging_vol[idx];
    this.setState({ priceMultiplier: vol })
  }

  handlePackagingCustomClick = () => {
    this.setState({ packagingType: null })
  }

  handleProductClick = (product_id) => {
    this.productStore.showModal(product_id)
    this.modalStore.toggleModal('product')
  }

  truncate = (text, length) => {
    if (text.length <= length) {
      return text
    }
    return text.slice(0, length) + '...'
  }

  render() {
    const { activeProduct, activeProductComments } = this.productStore
    if (!activeProduct) return null
    let recentThreeComments = []
    if (activeProductComments) recentThreeComments = activeProductComments.filter(comment => comment.comment).slice(0, 3)

    const {
      a_plus_url,
      allergens,
      available_inventory,
      avg_rating,
      buy_by_packaging,
      description,
      fbw,
      image_refs,
      ingredients,
      manufacturer,
      manufacturer_url_name,
      max_qty,
      name,
      nutritional_info_url,
      packaging_vol,
      packagings,
      product_id,
      similar_products,
      std_packaging,
      subcat_name,
      tags,
      unit_type,
      vendor,
    } = activeProduct;
    let  { unit_weight } = activeProduct;
    let shipMessage = `Fulfilled by The Wally Shop.`
    if (available_inventory[0]) shipMessage = `Sold and fulfilled by The Wally Shop`;
    if (fbw) shipMessage = "Sold by " + vendor + ", fulfilled by The Wally Shop."

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    const inventory = available_inventory[0] ? available_inventory[0] : null
    let qtyOptions = []

    const incrementValue = 1
    const minSize = 1
    const maxQty = Math.min(max_qty, 10)

    for (var i = 0; i < maxQty; i++) {
      var opt = minSize + i * incrementValue
      qtyOptions.push(+(opt.toFixed(3)))
    }

    let price = inventory.price / 100

    let totalPrice = price * this.state.qty * this.state.priceMultiplier

    var price_unit = ""
    if (['ea'].includes(unit_type)) {
        if (subcat_name) {
          price_unit = subcat_name;
        } else {
          price_unit = 'jar';
        }
    } else {
      price_unit += unit_type;
    }

    var weight_unit = "lbs"
    if (unit_weight && unit_weight < 0.05) {
      weight_unit = "oz"
      unit_weight = unit_weight * 16
    }

    if (unit_weight) {
      unit_weight.toFixed(1)
    }

    const packaging = packagings && packagings[0] ? packagings[0] : null
    const packaging_type = std_packaging
    const packaging_description = packaging ? packaging.description : null
    const packaging_size = inventory && inventory.packaging && inventory.packaging.size


    let jarIcons = (
      <div className="jar-icons">
        <div>
          <img src={ packaging_size === 8 ? `/images/jar8_icon.png` : `/images/jar8_grey_icon.png` } alt="Packaging size 8 oz" width="22" />
          <div>8 oz</div>
        </div>
        <div>
          <img src={ packaging_size === 16 || packaging_size === 25 ? `/images/jar8_icon.png` : `/images/jar8_grey_icon.png` } alt="Packaging size 25 oz" width="26" />
          <div>{ packaging_size === 16 ? "16 oz" : "25 oz" }</div>
        </div>
        <div>
          <img src={ packaging_size === 32 ? `/images/jar8_icon.png` : `/images/jar8_grey_icon.png` } alt="Packaging size 32 oz" width="30" />
          <div>32 oz</div>
        </div>
        <div>
          <img src={ packaging_size === 64 ? `/images/jar8_icon.png` : `/images/jar8_grey_icon.png` } alt="Packaging size 64 oz" width="34" />
          <div>64 oz</div>
        </div>
      </div>
    )

    return (
      <div className="product-modal-wrap">
        <Row>
          <Col sm="6">
            <div className="row mb-3">
              <div className="col-sm-6">
                <h3 className="mb-0">{name}</h3>
              </div>
              <div className="col-sm-6">
                <div id="thumbnailproduct-carousel" ref={el => this.thumb = el}>
                  {image_refs.map((item, key) => (
                    <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + item} alt="" /></div>
                  ))}
                  {nutritional_info_url && (
                    <div className="slick-item">
                      <img src={NUTRITIONAL_INFO_BASE_URL + nutritional_info_url} alt="Nutritional info" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="carousel-mobile-flex">
              <div id="product-carousel" ref={el => this.prod = el}>
                {image_refs.map((item, key) => (
                  <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + item} alt="" /></div>
                ))}
                {nutritional_info_url && (
                  <div className="slick-item">
                    <img src={NUTRITIONAL_INFO_BASE_URL + nutritional_info_url} alt="Nutritional info" />
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col sm="6">
            <div className="modal-product-price">Price: <span>{formatMoney(price)}</span> / {price_unit}</div>
            <div>{shipMessage}</div>
            <div>Sold by the jar.</div>
            { (['ea', 'bunch', 'pint'].includes(unit_type) && unit_weight) && <div>Unit weight is {unit_weight} {weight_unit}.</div> }
            <hr />

            <div className={infoPackageClass}>
              <strong>Packaged in:</strong> <i onClick={this.toggleInfoPackage} className="fa fa-info-circle"></i>
              {jarIcons}
              <div className="package-info-popover">
                <h4>{packaging_type}</h4>
                <p>{packaging_description}</p>
                <p>More sizes coming soon!</p>
              </div>
            </div>
            <div className="mb-3">
              {
                packaging_type
              }
            </div>
            {
              buy_by_packaging &&
              (
                <React.Fragment>
                  <div><strong>Size:</strong></div>
                  <AmountGroup
                    groupped={false}
                    className="package-type-group"
                    amountClick={this.handlePackagingChange}
                    customClick={this.handlePackagingCustomClick}
                    values={packagings ? packagings : []}
                    selected={packagings ? packagings[0].type : null}
                    weights={packagings ? packaging_vol : []}
                    unit_type={unit_type}
                    custom={false}
                    product={true}
                  />
                </React.Fragment>
              )
            }

            <div><strong>Choose your quantity</strong></div>
            <QuantitySelect
              value={this.state.qty}
              onSelectChange={this.handleSelectQuantity}
              options={qtyOptions}
              price_unit={buy_by_packaging ? "" : price_unit}
            />
            <hr/>
            <div className="mb-2">Total: {formatMoney(totalPrice)}</div>
            <button
              onClick={this.handleAddToCart}
              className={`btn btn-danger btn-add-cart mb-2 ${(this.state.outOfStock || !this.state.available) ? 'inactive' : ''}`}
            >
              {
                this.state.outOfStock
                  ? 'Out of Stock'
                  : (this.state.available ? 'Add to cart' : 'Unavailable')
              }
            </button><br />

            <div className='text-muted'>
              **Product packaged in a facility that processes dairy, gluten, peanuts and tree nuts.
            </div>
          </Col>
        </Row>
        {similar_products && similar_products.length > 0 && (
          <Row>
            <Col>
              <hr />
              <h3 className="mb-3">More Products Like This</h3>
              <Row className="similar-products-container">
                {similar_products.map((product, key) => {
                  return <Product key={key} product={product} onProductClick={() => this.handleProductClick(product.product_id)} />
                })}
              </Row>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <hr />
            <h3 className="mb-3">Product Info</h3>
            <div className="media media-xs">
              <div className="media-body">
              {manufacturer && (
                <div>
                  <span className="font-weight-bold">Producer: </span>
                  <Link
                    onClick={this.modalStore.toggleModal}
                    to={"/vendor/" + manufacturer_url_name}
                  >
                    {manufacturer}
                  </Link>
                </div>
                )}
                {description && (
                  <div><span className="font-weight-bold">Description: </span>{description}</div>
                )}
                {ingredients && ingredients.length > 0 && (
                  <div><span className="font-weight-bold">Ingredients: </span>{ingredients.join(', ')}</div>
                )}
                {allergens && allergens.length > 0 && (
                  <div><span className="font-weight-bold">Allergens: </span>{allergens.join(', ')}</div>
                )}
                {tags && tags.length > 0 && (
                  <div><span className="font-weight-bold">Tags: </span>{tags.join(', ')}</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
        {a_plus_url && (
          <Row>
            <Col>
              <hr />
              <div className="a-plus-image">
                <img src={a_plus_url} alt="A+" />
              </div>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <hr />
            <h3 className="mb-3">Product Ratings</h3>
            <div className="product-ratings-container">
              <span className="product-rating-label font-weight-bold">Product Rating: </span>
              {avg_rating ? <ProductRatingStars rating={avg_rating}/> : "No Ratings Yet"}
            </div>
            {recentThreeComments && recentThreeComments.length > 0 && (
              <React.Fragment>
                <div className="font-weight-bold">Comments:</div>
                <div className="comments-container">
                  {recentThreeComments.map((comment, key) => (
                    <div key={"comment-" + key} className="comment">
                      "{this.truncate(comment.comment, 200)}" - {comment.user_name}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </Col>
        </Row>
        {localStorage.user && (
          <ProductRatingForm product_id={product_id} />
        )}
      </div>
    )
  }
}

export default connect("store")(ProductModal)
