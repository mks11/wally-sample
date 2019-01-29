import React, { Component } from 'react'
import {
  Row,
  Col,
} from 'reactstrap'
import {
  formatMoney,
  logModalView,
  logEvent
} from 'utils'
import { PRODUCT_BASE_URL } from 'config'

class ProductModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      qty: 1,
      infoPackage: false,
      slick: false,
      subtitutes: [],
      selectedSubtitute: 0
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

    const { product } = this.props.stores

    if (product.activeProduct.organic) {
      subtitutes.unshift({
        id: 2,
        text: "Substitute for organic only"
      })
    }
    this.setState({ subtitutes })
    logModalView('/product/' + product.activeProductId)
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

    logEvent({category:"Product", action:"AddToCart", value:this.state.qty, label:product.activeProductId})
    const activeProduct = product.activeProduct
    const inventory = activeProduct.available_inventory[0] ? activeProduct.available_inventory[0] : null
    const order_summary = routing.location.pathname.indexOf('checkout') !== -1

    checkout.editCurrentCart({
      quantity: this.state.qty, 
      product_id: inventory.product_id,
      inventory_id: inventory._id,
      sub_pref: this.state.selectedSubtitute
    },
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

  render() {
    const { product } = this.props.stores
    const activeProduct = product.activeProduct

    if (!activeProduct) return null

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    const inventory = activeProduct.available_inventory[0] ? activeProduct.available_inventory[0] : null
    let qtyOptions = []
    var minSize = activeProduct.min_size
    for (var i = 0, len = 9; i <= len; i++) {
      var opt = minSize + i * activeProduct.increment_size
      qtyOptions.push(+(opt.toFixed(3)))
    }

    let price = inventory.price / 100
    const totalPrice = price * this.state.qty

    var unit_type = activeProduct.unit_type
    if (!unit_type) unit_type = activeProduct.price_unit
    var price_unit = ""
    if (['ea'].includes(unit_type)) {
        if (activeProduct.subcat_name) {
          price_unit += activeProduct.subcat_name  
        } else {
          price_unit += 'unit'
        }
    } else {
      price_unit += unit_type
    }

    var weight_unit = "lbs"
    var unit_weight = activeProduct.unit_weight;
    if (unit_weight && activeProduct.unit_weight && unit_weight < 0.05) {
      weight_unit = "oz"
      unit_weight = unit_weight * 16
    }

    if (unit_weight) {
      unit_weight.toFixed(1)
    }

    const packaging = activeProduct.packaging[0] ? activeProduct.packaging[0] : null
    const packaging_type = packaging.type
    const packaging_description = packaging.description

    return (
      <div className="product-modal-wrap">
        <Row>
          <Col sm="6">
            <div className="row mb-3">
              <div className="col-sm-6">
                <h3 className="mb-0">{activeProduct.name}</h3>
              </div>
              <div className="col-sm-6">
                <div id="thumbnailproduct-carousel" ref={el => this.thumb = el}>
                  {activeProduct.image_refs.map((item, key) => (
                    <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + activeProduct.product_id + "/" + item} alt="" /></div>
                  ))}
                </div>
              </div>
            </div>

            <div id="product-carousel" ref={el => this.prod = el}>
              {activeProduct.image_refs.map((item, key) => (
                <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + activeProduct.product_id + "/" + item} alt="" /></div>
              ))}
            </div>
          </Col>
          <Col sm="6">
            <div className="modal-product-price">Price: <span>{formatMoney(price)}</span> / {price_unit}</div>
            <div>Ship and sold by The Wally Shop.</div>
            <div>Sold by the {price_unit}.</div>
            { (['ea', 'bunch', 'pint'].includes(unit_type) && activeProduct.unit_weight) && <div>Average weight is {activeProduct.unit_weight} {weight_unit}.</div> }
            <hr />

            <div className={infoPackageClass}>
              <strong>Packaged in:</strong> <i onClick={this.toggleInfoPackage} className="fa fa-info-circle"></i>
              <div className="package-info-popover">
                <h4>{packaging_type}</h4>
                <p>{packaging_description}</p>
                <p><a href="#">Click here</a> to learn more or see full breakdown.</p>
              </div>
            </div>
            <div className="mb-3">{packaging_type}</div>

            <div><strong>Choose your quantity</strong></div>
            <div className="form-group" style={{maxWidth: '140px'}}>
              <select className="form-control" value={this.state.qty} onChange={e => this.setState({qty: e.target.value})}>
                { qtyOptions.map((v, i) => (<option key={i} value={v}>{`${v} ${price_unit}`}</option>)) }
              </select>
            </div>
            <hr/>
            <div><strong>If item is unavailable:</strong></div>
            {this.state.subtitutes.map((sub, key) => (
              <div 
                className={"custom-control red custom-radio " + (sub.id === this.state.selectedSubtitute ? " active" : "")}
                key={key}>
                <input 
                  type="radio"
                  name="customRadio" 
                  checked={this.state.selectedSubtitute === sub.id}
                  className="custom-control-input" 
                  value={sub.id} 
                  onChange={() => this.handleSelectSubtitute(sub.id)} />

                <label className="custom-control-label small" onClick={() => this.handleSelectSubtitute(sub.id)}>
                  {sub.text}&nbsp;
                </label>
                {
                  key === 1 ? (
                    <React.Fragment>
                      <i onClick={this.toggleSubstituteRecommendation} className="fa fa-info-circle"></i>
                      <div className={`${this.state.substituteRecommendation ? 'open' : ''}`}>
                        <div className="package-info-popover substitue-popover">
                          <p>We'll do our best to get a near perfect substitute for you, like spring onions for scallions. If we're unsure about it, we'll contact you to make sure the substitution works for you.</p>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null
                }
              </div>
            ))}
            <br/>
            <div className="mb-2">Total: {formatMoney(totalPrice)}</div>
            <button onClick={this.handleAddToCart} className="btn btn-danger btn-add-cart mb-2">Add to cart</button><br />
            <div className="text-muted">Final total subject to measured weights and at-location prices</div>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* <h4>About This Product</h4>
              <span>{product.description}</span> */}
            <hr />
            <h3>Farms</h3>

            <div className="media media-xs">
              <div className="media-body">
                <div className="row">
                  <div className="col-sm-6">
                    <div><span className="font-weight-bold">Local:</span> {activeProduct.local ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="col-sm-6">
                    <div><span className="font-weight-bold">Organic:</span> {activeProduct.organic ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                <div><span className="font-weight-bold">Farms:</span> {activeProduct.farms && activeProduct.farms.join(', ')}</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ProductModal