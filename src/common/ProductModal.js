import React, { Component } from 'react';
import { formatMoney, connect, logModalView, logEvent } from '../utils'
import { PRODUCT_BASE_URL } from '../config'
import {Modal} from "react-bootstrap";

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

    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }

  componentDidMount() {
    let subtitutes = [{
      id: 0,
      text: "Substitute with Wally Shop recommendation"
    }, {
      id: 1,
      text: "Remove item"
    }]

    if (this.productStore.activeProduct.organic) {
      subtitutes.unshift({
        id: 2,
        text: "Substitute for organic only"
      })
    }

    this.setState({subtitutes})

    logModalView('/product/' + this.productStore.activeProductId)
    
  }

  componentDidUpdate() {
    if (!this.state.slick) {
      this.setState({slick: true, qty: this.productStore.customer_quantity})
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

  toggleInfoPackage() {
    this.setState({infoPackage: !this.state.infoPackage})
  }

  handleAddToCart() {
    logEvent({category:"Product", action:"AddToCart", value:this.state.qty, label:this.productStore.activeProductId})
    const product = this.productStore.activeProduct
    const inventory = product.available_inventory[0] ? product.available_inventory[0] : null
    const order_summary = this.routing.location.pathname.indexOf('checkout') !== -1

    this.checkoutStore.editCurrentCart({
      quantity: this.state.qty, 
      product_id: inventory.product_id,
      inventory_id: inventory._id,
      sub_pref: this.state.selectedSubtitute
    }, this.userStore.getHeaderAuth(), order_summary, this.userStore.getDeliveryParams()).then((data) => {
      this.props.onAddToCart && this.props.onAddToCart(data)
    }).catch((e) => {
      console.log(e)
      if (e.response) {
        const msg = e.response.data.error.message
        this.setState({invalidText: msg})
        console.error('Failed to add to cart', e)
      }
    })

    this.productStore.hideModal()
  }

  handleSelectSubtitute(id) {
    logEvent({category:"Product", action:"ChooseSubstitute"})
    this.setState({selectedSubtitute: id})
  }

  handleCloseModal(e) {
    logEvent({category:"Product", action:"ClickClosed", label:this.productStore.activeProductId})
    this.productStore.hideModal(e)
  }


  render() {
    const product = this.productStore.activeProduct

    if (!product) return null

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    const inventory = product.available_inventory[0] ? product.available_inventory[0] : null
    let qtyOptions = []
    var minSize = product.min_size
    // if (inventory.price_unit == "lb" || inventory.price_unit == "oz") minSize = 0.25
    for (var i = 0, len = 9; i <= len; i++) {
      var opt = minSize + i * product.increment_size
      qtyOptions.push(+(opt.toFixed(3)))
      
    }

    let price = inventory.price / 100
    const totalPrice = price * this.state.qty

    var unit_type = product.unit_type
    if (!unit_type) unit_type = product.price_unit
    var price_unit = ""
    if (['ea'].includes(unit_type)) {
        if (product.subcat_name) {
          price_unit += product.subcat_name  
        } else {
          price_unit += 'unit'
        }
    } else {
      price_unit += unit_type
    }

    var weight_unit = "lbs"
    var unit_weight = product.unit_weight;
    if (unit_weight && product.unit_weight && unit_weight < 0.05) {
      weight_unit = "oz"
      unit_weight = unit_weight * 16
    }

    if (unit_weight) {
      unit_weight.toFixed(1)
    }

    const packaging = product.packaging[0] ? product.packaging[0] : null
    const packaging_type = packaging.type
    const packaging_description = packaging.description

    return (
      <Modal show={this.productStore.modal} size="lg" onExited={e => this.productStore.closeModal()} onHide={e => this.productStore.hideModal(e)}>
        <div className="modal-header">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.handleCloseModal(e)} ></button>
        </div>
        <Modal.Body className="modal-body-no-footer product-modal">
          <div className="row">
            <div className="col-md-6 product-modal-left">
              <div className="row mb-3">
                <div className="col-sm-6">
                  <h3 className="mb-0">{product.name}</h3>
                </div>
                <div className="col-sm-6">
                  <div id="thumbnailproduct-carousel" ref={el => this.thumb = el}>
                    {product.image_refs.map((item, key) => (
                      <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + product.product_id + "/" + item} alt="" /></div>
                    ))}
                  </div>
                </div>
              </div>

              <div id="product-carousel" ref={el => this.prod = el}>
                {product.image_refs.map((item, key) => (
                  <div key={key} className="slick-item"><img src={PRODUCT_BASE_URL + product.product_id + "/" + item} alt="" /></div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div className="modal-product-price">Price: <span>{formatMoney(price)}</span> / {price_unit}</div>
              <div>Ship and sold by The Wally Shop.</div>
              <div>Sold by the {price_unit}.</div>
              { (['ea', 'bunch', 'pint'].includes(unit_type) && product.unit_weight) && <div>Average weight is {product.unit_weight} {weight_unit}.</div> }
              <hr />

              <div className={infoPackageClass}>
                <strong>Packaged in:</strong> <i onClick={e => this.toggleInfoPackage(e)} className="fa fa-info-circle"></i>
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
                  { qtyOptions.map((v, i) => {
                    // let unit = qty_unit_type
                    // if (unit !== '' && v>1) {
                    //   unit = qty_unit_type+'s'
                    // }

                    return(
                      <option key={i} value={v}>{v}</option>
                    )
                  })}
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
                    onChange={e=>this.handleSelectSubtitute(sub.id)} />

                  <label className="custom-control-label small" onClick={e=>this.handleSelectSubtitute(sub.id)}>
                    {sub.text}
                  </label>
                </div>
              ))}
              <br/>
              <div className="mb-2">Total: {formatMoney(totalPrice)}</div>
              <button onClick={e => this.handleAddToCart()} className="btn btn-danger btn-add-cart mb-2">Add to cart</button><br />
              <div className="text-muted">Final total subject to measured weights and at-location prices</div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {/* <h4>About This Product</h4>
              <span>{product.description}</span> */}
              <hr />
              <h3>Farms</h3>

              <div className="media media-xs">
                <div className="media-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div><span className="font-weight-bold">Local</span>: {product.local ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="col-sm-6">
                      <div><span className="font-weight-bold">Organic</span>: {product.organic ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  <div><span className="font-weight-bold">Farms</span>: {product.farms && product.farms.join(', ')}</div>
                </div>
              </div>
            </div>

          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connect("store")(ProductModal);
