import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class DeleteModal extends Component {
  constructor(props) {
    super(props)
    this.checkoutStore = this.props.store.checkout
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }

  handleDelete() {
    const order_summary = this.routing.location.pathname.indexOf('checkout') !== -1
    this.checkoutStore.editCurrentCart({
      quantity: 0, 
      product_id: this.checkoutStore.deleteId.product_id,
      inventory_id: this.checkoutStore.deleteId.inventory_id,
    }, this.userStore.getHeaderAuth(), order_summary, this.userStore.getDeliveryParams()).then((data) => {

    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to add to cart', e)
    })

    this.checkoutStore.toggleDeleteModal()
  }

   render() {
    return (
      <Modal isOpen={this.checkoutStore.deleteModal} >
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.checkoutStore.toggleDeleteModal(e)}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Are you sure you want to delete this item?
            </h3>
            <button onClick={e => this.handleDelete()}
              className="btn btn-main active mt-4">DELETE</button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeleteModal);
