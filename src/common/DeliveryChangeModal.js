import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class DeliveryChangeModal extends Component {
  handleChangeDelivery = () => {
    const modalStore = this.props.store.modal
    const userStore = this.props.store.user

    if (modalStore.deliveryChangeType === 'address') {
      userStore.setDeliveryAddress(modalStore.deliveryChangeData.address)
      if (modalStore.deliveryChangeData.times && modalStore.deliveryChangeData.times.length > 0) {
        const items = modalStore.deliveryChangeData.times[0]
        const item = items.data[0]
        const selected = {day: items.day, time: item.time, date: item.date, availability: item.availability}
        userStore.setDeliveryTime(selected)
      }
    } else {
      userStore.setDeliveryTime(modalStore.deliveryChangeData)
    }
    modalStore.hideDeliveryChange()
    this.props.onChangeSubmit()
  }

  render() {
    const modalStore = this.props.store.modal
    return (
      <Modal isOpen={modalStore.deliveryChange} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => modalStore.hideDeliveryChange(e)}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-center" style={{lineHeight: '40px'}}>Delivery change</h3>
            <p>
              Product selection changes on a daily basis. Are you sure you want to change? This may change the products available and in your cart.
            </p>
            <button onClick={this.handleChangeDelivery} className="btn btn-main active">Submit</button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(DeliveryChangeModal);
