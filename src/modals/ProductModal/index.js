import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
} from 'reactstrap'
import {
  formatMoney,
  logModalView,
  logEvent
} from 'utils'
import {
  PRODUCT_BASE_URL,
  NUTRITIONAL_INFO_BASE_URL,
  PACKAGING_BASE_URL,
} from 'config'
import AmountGroup from 'common/AmountGroup'

import QuantitySelect from '../../common/QuantitySelect'
import Product from '../../pages/Mainpage/Product/index'
import ProductRatingForm from '../../common/ProductRatingForm'
import StarsRating from '../../common/StarsRating'

class ProductModal extends Component {
  constructor(props) {
    super(props)
    console.log('props', props)
    this.state = {
      qty: 1,
      infoPackage: false,
      slick: false,
      subtitutes: [],
      selectedSubtitute: 0,
      packagingAddon: '',
      quantityAddon: 0,
      outOfStock: false,
      available: true,
      availableDays: [],
      packagingType: null,
      priceMultiplier: 1
    }
  }

  componentDidMount() {
    const subtitutes = [{
      id: 0,
      text: "Substitute with Wally Shop recommendation"
    }, {
      id: 1,
      text: "Remove item"
    }]

    const { product, modal, user } = this.props.stores
    this.state.qty = product.activeProduct.min_size
    let priceMultiplier = product.activeProduct.buy_by_packaging ? product.activeProduct.packaging_vol[0] : 1
    this.setState({ priceMultiplier: priceMultiplier });

    let packagingType = product.activeProduct.buy_by_packaging ? product.activeProduct.packagings[0].type : null
    this.setState({ packagingType: packagingType });

    if (product.activeProduct.organic) {
      subtitutes.unshift({
        id: 2,
        text: "Substitute for organic only"
      })
    }

    const daysOfWeek = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
    let availableDays = product.activeProduct.available_days.sort()
    availableDays = availableDays.map(d => daysOfWeek[d]);

    this.setState({
      subtitutes,
      outOfStock: product.activeProduct.fbw && product.activeProduct.out_of_stock,
      available: product.activeProduct.available_for_delivery,
      availableDays: availableDays
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

  toggleSubstituteRecommendation = () => {
    this.setState({ substituteRecommendation: !this.state.substituteRecommendation })
  }

  handleSelectSubtitute(id) {
    logEvent({category:"Product", action:"ChooseSubstitute"})
    this.setState({ selectedSubtitute: id })
  }

  // handleCloseModal(e) {
  //   logEvent({category:"Product", action:"ClickClosed", label:this.productStore.activeProductId})
  //   this.props.toggle()
  // }

  handleAddToCart = () => {
    const { product, checkout, user, routing } = this.props.stores
    const { custom, customIsEmpty, quantityAddon, packagingAddon, outOfStock, available, packagingType } = this.state

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
    const unit_type = activeProduct.unit_type || activeProduct.price_unit
    
    const finalUnitType =
      (activeProduct.buy_by_packaging && packagingType)
        ? 'packaging'
        : unit_type
    const packaging = activeProduct.packagings[0] ? activeProduct.packagings[0] : null
    const defaultPackagingId = packaging ? packaging.id : null
    const customPackaging = packagingType ? activeProduct.packagings.find(p => p.type === packagingType)._id : null
    const packagingId = customPackaging || defaultPackagingId

    const items = [
      {
        quantity: this.state.qty, 
        product_id: inventory.product_id,
        inventory_id: inventory._id,
        sub_pref: this.state.selectedSubtitute,
        unit_type: finalUnitType,
        packaging_id: packagingId,
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
        console.log(e)
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

  truncate = (text, length) => {
    if (text.length <= length) {
      return text
    }
    // const disallowedLastChars = ['.', ',', ':', '!', '(', ')', ' ']
    return text.slice(0, length) + '...'
  }

  render() {
    const { packagingType } = this.state
    const { product, modal } = this.props.stores
    const activeProduct = product.activeProduct
    const topThreeComments = product.activeProductComments.slice(0, 3)

    if (!activeProduct) return null

    // HERE! UPDATE WHEN SCHEMA IS UPDATED
    const {
      a_plus_url,
      allergens,
      available,
      available_inventory,
      buy_by_packaging,
      description,
      fbw,
      image_refs,
      increment_size,
      ingredients,
      manufacturer,
      manufacturer_url_name,
      max_qty,
      min_size,
      name,
      nutritional_info_url,
      out_of_stock,
      packaging_vol,
      packagings,
      product_id,
      rating,
      similar_products,
      std_packaging,
      subcat_name,
      tags,
      unit_type,
      unit_weight,
      vendor,
    } = activeProduct

    let shipMessage = `Fulfilled by The Wally Shop.`
    if (available_inventory[0]) shipMessage = `Sold by ${available_inventory[0].shop}, fulfilled by The Wally Shop`;
    if (fbw) shipMessage = "Sold by " + vendor + ", fulfilled by The Wally Shop."

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    const inventory = available_inventory[0] ? available_inventory[0] : null
    const limitOptions = fbw && !out_of_stock && available
    let qtyOptions = []

    const incrementValue = (buy_by_packaging && packagingType) ? 1 : increment_size
    const minSize = (buy_by_packaging && packagingType) ? 1 : min_size
    const maxQty = limitOptions ? Math.min(max_qty, 10) : 10
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
          price_unit = 'unit';
        }
    } else {
      price_unit += unit_type;
    }

    var weight_unit = "lbs"
    if (unit_weight && unit_weight && unit_weight < 0.05) {
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
    const packaging_image_url = packaging_size && ("jar-" + packaging_size + ".jpg")
    console.log('activeProduct', activeProduct)
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
                  <div className="slick-item">
                    <img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"/>
                  </div>
                  <div className="slick-item">
                    <img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"/>
                  </div>
                  {image_refs.map((item, key) => (
                    <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + item} alt="" /></div>
                  ))}
                  {nutritional_info_url && (
                    <div className="slick-item">
                      <img src={NUTRITIONAL_INFO_BASE_URL + nutritional_info_url} alt="Nutritional info" />
                    </div>
                  )}
                  {packaging_size && (
                    <div className="slick-item">
                      <img src={PACKAGING_BASE_URL + packaging_image_url} alt={"Packaging size " + packaging_size} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div id="product-carousel" ref={el => this.prod = el}>
              <div className="slick-item">
                <img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"/>
              </div>
              <div className="slick-item">
                <img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"/>
              </div>
              {image_refs.map((item, key) => (
                <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + item} alt="" /></div>
              ))}
              {nutritional_info_url && (
                <div className="slick-item">
                  <img src={NUTRITIONAL_INFO_BASE_URL + nutritional_info_url} alt="Nutritional info" />
                </div>
              )}
              {packaging_size && (
                <div className="slick-item">
                  <img src={PACKAGING_BASE_URL + packaging_image_url} alt={"Packaging size " + packaging_size} />
                </div>
              )}
            </div>
          </Col>
          <Col sm="6">
            <div className="modal-product-price">Price: <span>{formatMoney(price)}</span> / {price_unit}</div>
            <div>{shipMessage}</div>
            <div>Sold by the {price_unit}.</div>
            { (['ea', 'bunch', 'pint'].includes(unit_type) && unit_weight) && <div>Average weight is {unit_weight} {weight_unit}.</div> }
            <hr />

            <div className={infoPackageClass}>
              <strong>Packaged in:</strong> <i onClick={this.toggleInfoPackage} className="fa fa-info-circle"></i>
              <div className="package-info-popover">
                <h4>{packaging_type}</h4>
                <p>{packaging_description}</p>
                <p><a href="#">Click here</a> to learn more or see full breakdown.</p>
              </div>
            </div>
            <div className="mb-3">
              { 
                !buy_by_packaging 
                  ? packaging_type
                  : std_packaging
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

            <div 
              className={`${(this.state.available) ? 'text-muted' : 'text-muted-alert' }`}
            > 
              {
                this.state.available ? '' : 'Click on clock icon next to categories to change delivery date.'
              }
            </div>
          </Col>
        </Row>
        {/* {similar_products && similar_products.length > 0 && ( */}
          <Row>
            <Col>
              <hr />
              <h3 className="mb-3">More Products Like This</h3>
              <Row>
                {/* {similar_products.map((product, key) => (
                  <Product product={product} onProductClick={modal.toggleProduct} />
                ))} */}
                <Product product={activeProduct} onProductClick={modal.toggleProduct} />
                <Product product={activeProduct} />
                <Product product={activeProduct} />
                <Product product={activeProduct} />
              </Row>
            </Col>
          </Row>
        {/* )} */}
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
                    onClick={modal.toggleModal}
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
                <img src={a_plus_url} alt="A+ image" />
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
              {rating ? <StarsRating rating={rating}/> : "No Ratings Yet"}
            </div>
            {topThreeComments && topThreeComments.length > 0 && (
              <React.Fragment>
                <div className="font-weight-bold">Comments:</div>
                <div className="comments-container">
                  {topThreeComments.map((comment, key) => (
                    <div key={"comment-" + key} className="comment">
                      "{this.truncate(comment.text, 200)}" - {comment.user}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </Col>
        </Row>
        <ProductRatingForm />
      </div>
    )
  }
}

export default ProductModal