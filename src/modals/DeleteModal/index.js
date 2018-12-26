import React, { Component } from 'react';
import { logEvent } from '../../utils'

class DeleteModal extends Component {
  constructor(props) {
    super(props)
  }

  handleDelete = () => {
    logEvent({ category: "Cart", action: "ConfirmDelete" })
    const {
      routing,
      checkout,
      user,
      modal
    } = this.props.stores

    const order_summary = routing.location.pathname.indexOf('checkout') !== -1

    checkout.editCurrentCart({
        quantity: 0, 
        product_id: modal.msg.product_id,
        inventory_id: modal.msg.inventory_id,
      },
      user.getHeaderAuth(),
      order_summary,
      user.getDeliveryParams()
    ).then(data => {

    }).catch(e => {
      const msg = e.response.data.error.message
      this.setState({ invalidText: msg })
      console.error('Failed to add to cart', e)
    })

    this.props.toggle()
  }

   render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2 text-center" style={{ lineHeight: '40px' }}>Are you sure you want to delete this item?
        </h3>
        <button onClick={this.handleDelete}
          className="btn btn-main active mt-4">DELETE</button>
      </div>
    )
  }
}

export default DeleteModal
