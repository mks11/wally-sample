import React, { Component } from 'react'
import {
  formatMoney,
  connect,
  logEvent,
  logModalView,
} from 'utils'

class CartDropdown extends Component {
  constructor(props) {
    super(props)
  }

  handleMouseEnter = () => {
    const { ui } = this.props
    ui.showBackdrop()
    logModalView('/cart')
  }

  handleMouseLeave = () => {
    const { ui } = this.props
    ui.hideBackdrop()
    logEvent({ category: 'Cart', action: "CloseCart" })
  }

  handleMouseEnterWithoutLog = () => {
    const { ui } = this.props
    ui.showBackdrop()
  }

  handleMouseLeaveWithoutLog = () => {
    const { ui } = this.props
    ui.hideBackdrop()
  }

  handleCheckout = () => {
    const { onCheckout } = this.props
    logEvent({ category: "Cart", action: "ClickCheckout" })
    const { ui } = this.props
    ui.hideBackdrop()
    onCheckout && onCheckout()
  }

  handleEdit(data) {
    const { onEdit } = this.props
    logEvent({category: "Cart", action: "ClickEditProduct"})
    onEdit && onEdit(data)
  }

  handleDelete(id) {
    const { onDelete } = this.props
    logEvent({category: "Cart", action: "ClickDeleteProduct"})
    onDelete && onDelete(id)
  }

  render() {
    const { cart } = this.props

    const items = cart ? cart.cart_items : []
    const count = items.length
    const subtotal = cart ? (cart.subtotal / 100) : 0

    // const deliveryFeeInfo =
    //   cart && cart.subtotal < 3500
    //     ? <span className="delivery-fee-info">Reduced delivery fee on orders above $35 - add {formatMoney((3500 - cart.subtotal) / 100)}</span>
    //     : null

    const deliveryFeeInfo = null

    return (
      <div className="dropdown-cart-wrapper">
        <div className="btn-group dropdown-cart" >
          <div
            className={`product-cart-counter ${count > 0 ? 'active' : ''}`}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleCheckout}
          >
            <i className="fa fa-shopping-bag" /><span><strong>{count} {count > 1 ? 'Items' : 'Item'}</strong></span>
          </div>

          <div
            className="dropdown-wrapper"
            onMouseEnter={this.handleMouseEnterWithoutLog}
            onMouseLeave={this.handleMouseLeaveWithoutLog}
          >
            <div className="dropdown-menu dropdown-menu-right">
              { (items && count > 0) ?
                  <React.Fragment>
                    <h3 className="px-3">Orders: {deliveryFeeInfo}</h3>
                    <div className="order-summary">
                      <div className="order-scroll px-3">
                        { items.map((c, i) => {
                          const unit_type = c.unit_type || c.price_unit
                          const showType = unit_type === 'packaging' ? c.packaging_name : unit_type
                          return (
                            <div className="item mt-3 pb-2" key={i}>
                              <div className="item-left">
                                <h4 className="item-name">{c.product_name}</h4>
                                {
                                  unit_type !== 'packaging' && <span className="item-detail mb-1">{c.packaging_name}</span>
                                }
                                
                                <div className="item-link">
                                  <a className="text-blue mr-2" onClick={() => this.handleEdit({product_id: c.product_id, customer_quantity: c.customer_quantity})}>EDIT</a>
                                  <a className="text-dark-grey" onClick={() => this.handleDelete({product_id: c.product_id, inventory_id: c._id})}>DELETE</a>
                                </div>
                              </div>
                              <div className="item-right">
                                <h4>x{c.customer_quantity} {showType}</h4>
                                <span className="item-price">{formatMoney(c.total/100)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="item-total px-3">
                        <span>Total</span>
                        <span>{formatMoney(subtotal)}</span>
                      </div>
                    </div>
                    <button onClick={this.handleCheckout} className="btn mx-3 w-90 btn-main active">CHECKOUT</button>
                  </React.Fragment>
                  : <span className="px-3">No items in cart</span>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CartDropdown