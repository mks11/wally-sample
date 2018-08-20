import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { formatMoney, connect } from '../utils'
import { APP_URL } from '../config'

class ProductModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      qty: 1,

      infoPackage: false,
      slick: false,
    }

    this.productStore = this.props.store.product
    this.checkoutStore = this.props.store.checkout
    this.userStore = this.props.store.user
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
        arrows: false
      });
      $thumb.slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        asNavFor: '#product-carousel',
        dots: false,
        infinite: false,
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

    this.checkoutStore.editCurrentCart({
      quantity: this.state.qty, 
      product_id: inventory.product_id,
      inventory_id: inventory._id,
    }, this.userStore.getHeaderAuth()).then((data) => {

    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to add to cart', e)
    })

    this.productStore.hideModal()
  }


  render() {
    const product = this.productStore.activeProduct

    if (!product) return null

    let infoPackageClass = 'package-info'
    if (this.state.infoPackage) {
      infoPackageClass += ' open'
    }

    let qtyOptions = []
    for (var i = product.min_size, len = 10; i < len; i++) {
      qtyOptions.push(i)
    }


    const inventory = product.available_inventory[0] ? product.available_inventory[0] : null
    const price = inventory.price
    let price_unit = product.unit_size

    let unit = 1
    if (price_unit) {
      unit = parseFloat(price_unit.split(' ')[0])
    } else {
      price_unit = unit + ' ' + product.unit_type
    }

    const totalPrice = price / unit * this.state.qty


    const packaging = product.packaging[0] ? product.packaging[0] : null
    const packaging_type = packaging.type
    const packaging_description = packaging.description



    return (
      <Modal isOpen={this.productStore.modal} size="lg" onClosed={e => this.productStore.closeModal()} >
        <div className="modal-header">
          <button className="btn-icon btn-icon--back"></button>
          <button className="btn-icon btn-icon--close" onClick={e => this.productStore.hideModal(e)} ></button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 product-modal-left">
              <div className="row mb-3">
                <div className="col-sm-6">
                  <h3 className="mb-0">{product.name}</h3>
                  <div>Hillside Farms, NY</div>
                </div>
                <div className="col-sm-6">
                  <div id="thumbnailproduct-carousel" ref={el => this.thumb = el}>
                    <div className="slick-item"><img src={APP_URL + "/images/product_thumbnail.png"} /></div>
                    <div className="slick-item"><img src={APP_URL + "/images/product_thumbnail.png"} /></div>
                    <div className="slick-item"><img src={APP_URL + "/images/product_thumbnail.png"} /></div>
                  </div>
                </div>
              </div>

              <div id="product-carousel" ref={el => this.prod = el}>
                <div className="slick-item"><img src={APP_URL + "/images/img-01.jpg"} /></div>
                <div className="slick-item"><img src={APP_URL + "/images/img-01.jpg"} /></div>
                <div className="slick-item"><img src={APP_URL + "/images/img-01.jpg"} /></div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="modal-product-price">Price: <span>{formatMoney(price)}</span> / {price_unit}</div>
              <div>Ship and sold by {product.producer}</div>
              <hr />

              <div className={infoPackageClass}>
                <strong>Packaged in:</strong> <i onClick={e => this.toggleInfoPackage(e)} className="fa fa-info-circle"></i>
                <div className="package-info-popover">
                  <h4>{packaging_type}</h4>
                  <p>{packaging_description}</p>
                  <p><a href="#">Click here</a> to learn more or see full breakdown.</p>
                </div>
              </div>
              <div className="mb-3">Plastic container std</div>

              <div><strong>Chose your quantity</strong></div>
              <div className="form-group" style={{maxWidth: '140px'}}>
                <select className="form-control" value={this.state.qty} onChange={e => this.setState({qty: e.target.value})}>
                  { qtyOptions.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">Total: {formatMoney(totalPrice)}</div>
              <button onClick={e => this.handleAddToCart()} className="btn btn-danger">Add to cart</button><br />
              <div className="text-muted">Final price based on approximate eight</div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>About This Product</h4>
              <span>{product.description}</span>
              <hr />
              <h3>Farms</h3>

              <div className="media media-xs">
                <div className="media-img mr-4"><img src="images/img-02.jpg" className="img-fluid" /></div>
                <div className="media-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div><span className="font-weight-bold">Name</span>: {product.producer}</div>
                      <div><span className="font-weight-bold">Location</span>: Albany Ly</div>
                    </div>
                    <div className="col-sm-6">
                      <div><span className="font-weight-bold">Organic</span>: yes</div>
                      <div><span className="font-weight-bold">Pestiside-Free</span>: yes</div>
                    </div>
                  </div>
                  <div><span className="font-weight-bold">Certification</span>: Ny Organic Sertificated, National Green Farms Certification</div>
                  <div><span className="font-weight-bold">Description</span>: e the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset shet</div>
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
