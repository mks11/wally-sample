import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { formatMoney, connect } from '../utils'
import { PRODUCT_BASE_URL } from '../config'

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
    this.setState({selectedSubtitute: id})
  }


  render() {
    const product = this.productStore.activeProduct

    if (!product) return null

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    let qtyOptions = []
    for (var i = 1, len = 10; i <= len; i++) {
      qtyOptions.push(i*product.min_size)
    }


    const inventory = product.available_inventory[0] ? product.available_inventory[0] : null
    let price = inventory.price / 100
    let price_unit = inventory.price_unit
    let unit_type = product.unit_type
    let unit_size = product.unit_size

    let unit = 1

    if (price_unit !== unit_type &&  unit_size) {
      unit = parseFloat(unit_size.split(' ')[0])
    }

    // let unit = 1
    // if (price_unit) {
    //   unit = parseFloat(price_unit.split(' ')[0])
    // } else {
    //   // price_unit = unit + ' ' + product.unit_type
    // }
    //
    // price = price*unit

    const totalPrice = price  * unit * this.state.qty


    const packaging = product.packaging[0] ? product.packaging[0] : null
    const packaging_type = packaging.type
    const packaging_description = packaging.description

    // const producer = inventory.producer


    // console.log('unittype', unit_type)
    let  qty_unit_type = unit_type 
    if (qty_unit_type === 'unit' || qty_unit_type === 'ea') {
      qty_unit_type = ''
    }


    return (
      <Modal isOpen={this.productStore.modal} size="lg" onClosed={e => this.productStore.closeModal()} toggle={e => this.productStore.hideModal(e)}>
        <div className="modal-header">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.productStore.hideModal(e)} ></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="row">
            <div className="col-md-6 product-modal-left">
              <div className="row mb-3">
                <div className="col-sm-6">
                  <h3 className="mb-0">{product.name}</h3>
                  {/* <div>Hillside Farms, NY</div>*/}
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
              <div>Ship and sold by The Wally Shop</div>
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
                    let unit = qty_unit_type
                    if (unit !== '' && v>1) {
                      unit = qty_unit_type+'s'
                    }

                    return(
                      <option key={i} value={v}>{v} {unit}</option>
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
              <div className="text-muted">Final price based on approximate weight</div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>About This Product</h4>
              <span>{product.description}</span>
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
                  <div><span className="font-weight-bold">Farms</span>: {product.farms && product.farms.join(',')}</div>
                </div>
              </div>
            </div>

          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ProductModal);
