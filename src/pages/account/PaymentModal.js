import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../../utils'
import { STRIPE_API_KEY } from '../../config'

import Card from '../../common/Card';
import {StripeProvider, Elements} from 'react-stripe-elements'

class PaymentModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payment_id: null,
      cardnumber: '',
      cvv: '',
      mmyy: '',
      zip: '',
      default: false,

      title: 'Add Payment Card',
      mode: 'add',
      invalidText: null,

      deleteConfirmation: false
    }


    this.userStore = this.props.store.user
  }

  componentDidMount() {
    if (this.userStore.activePayment) {
      const payment = this.userStore.activePayment
      this.setState({
        payment_id: payment._id,
        cardnumber: payment.cardnumber,
        title: 'Edit Payment Card',
        mode: 'edit',
        default: this.userStore.user.preferred_payment === payment._id
      })
    } else {
      // this.setState({
      //   name: this.userStore.user.name,
      //   telephone: this.userStore.user.telephone,
      // })
    }
  }

  handleAddPayment = data => {
    if (data) {
      this.userStore.setUserData(data)
      this.userStore.hidePaymentModal()
    }
  }

  handleMakeDefault() {
    if (this.state.default) {
      return
    }
    this.userStore.makeDefaultPayment(this.state.payment_id).then((data) => {
      this.userStore.setUserData(data)
      this.userStore.hidePaymentModal()
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to edit payment', e)
    })

  }
  handleDeleteConfirm() {
    this.setState({
      deleteConfirmation: true
    })
  }
  handleDelete() {
    this.setState({deleteConfirmation: false})
    this.userStore.hidePaymentModal()
    this.userStore.deletePayment(this.state.payment_id).then((data) => {
      this.userStore.setUserData(data)
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to delete address', e)
    })
  }
  render() {
    return (
      <Modal isOpen={this.userStore.paymentModal} className="modal-outline" onClosed={e => this.userStore.closePaymentModal()}>
    
        <div className="modal-header">
          <h2>{this.state.title}</h2>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.hidePaymentModal(e)}></button>
        </div>
        {this.state.mode === 'add' &&
            <StripeProvider apiKey={STRIPE_API_KEY}>
              <Elements>
                <Card 
                  addPayment={this.handleAddPayment}
                  userStore={this.userStore}
                />
              </Elements>
            </StripeProvider>
        }

      { this.state.mode === 'edit' ?
          <ModalBody className="modal-body-bordertop">

            <ul className="list-payments list-payments--noborder">
              <li>
                <span className="payments--card">*****{this.state.last4}</span>
                <span className="addresses--default button">
                  { this.state.default ? (
                    <span>DEFAULT</span>
                  ): null}
                </span>
              </li>
            </ul>
          </ModalBody>

          :null}

      { this.state.mode === 'edit'  && !this.state.deleteConfirmation ?
          <ModalBody className="modal-body-bordertop" style={{display: 'flex',justifyContent: 'space-between'}}>
            <button onClick={e=>this.handleDeleteConfirm(e)} 
              className="btn btn-main my-3 white" style={{width: '40%'}}>DELETE</button>

            <button onClick={e=>this.handleMakeDefault(e)}
              className={"btn btn-main my-3 active"+ (this.state.default ? " disabled": "")}
              style={{width: '40%'}} >MAKE DEFAULT</button>
          </ModalBody>
          :null}

        { this.state.deleteConfirmation ?  (
        <ModalBody className="modal-body-bordertop">
          <button onClick={e=>this.handleDelete(e)} 
            className="btn btn-main my-3 active">CONFIRM</button>

          <span className="text-error text-center text-block">Are you sure want to delete this payment?</span>
        </ModalBody>
        ): null}

    </Modal>
    );
  }
}

export default connect("store")(PaymentModal);
