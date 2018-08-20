import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
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
        cardnumber: payment.cardnumber,
        title: 'Edit Payment Card',
        mode: 'edit',
        default: this.userStore.user.preferred_payment === payment.payment_id
      })
    } else {
      // this.setState({
      //   name: this.userStore.user.name,
      //   telephone: this.userStore.user.telephone,
      // })
    }
  }

  handleSubmit(e) {
    this.setState({invalidText: null})
    if (!this.state.cardnumber) {
      this.setState({invalidText: 'Cardnumber cannot be empty'})
      return
    }

    if (!this.state.cvv) {
      this.setState({invalidText: 'CVV cannot be empty'})
      return
    }

    if (!this.state.mmyy) {
      this.setState({invalidText: 'Expiration date cannot be empty'})
      return
    }

    if (!this.state.zip) {
      this.setState({invalidText: 'Zip cannot be empty'})
      return
    }
    this.userStore.savePayment(this.state).then((data) => {
      this.userStore.hidePaymentModal()
    }).catch((e) => {
      console.log('Failed to save payment', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })
    e.preventDefault()
  }

  handleMakeDefault() {
    if (this.state.default) {
      return
    }
    this.userStore.makeDefaultPayment(this.state.address_id)
    this.userStore.hidePaymentModal()
  }
  handleDeleteConfirm() {
    this.setState({
      deleteConfirmation: true
    })
  }
  handleDelete() {
    this.userStore.deletePayment(this.state.payment_id)
    this.userStore.hidePaymentModal()
  }
  render() {
     let buttonClass = 'btn btn-main my-3'
     if (this.state.cardnumber && this.state.cvv && this.state.mmyy && this.state.zip) {
       buttonClass += ' active'
     }
    return (
      <Modal isOpen={this.userStore.paymentModal} className="modal-outline" onClosed={e => this.userStore.closePaymentModal()}>
    
        <div className="modal-header">
          <h2>{this.state.title}</h2>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.hidePaymentModal(e)}></button>
        </div>
        {this.state.mode === 'add' ? 
        <form onSubmit={e=>e.preventDefault()}>

          <ModalBody>
            <StripeProvider apiKey={STRIPE_API_KEY}>
            <Elements>
              <Card />
            </Elements>
          </StripeProvider>

            <FormGroup className="input-merged">
            <Input
              style={{width: '40%'}}
              className="aw-input--control aw-input--control-large aw-input--left "
              type="text"
              placeholder="Card number"
              onChange={(e) => this.setState({cardnumber: e.target.value})}/>
            <Input
              style={{width: '30%'}}
              className="aw-input--control aw-input--control-large aw-input--left "
              type="text"
              placeholder="MM/YY"
              onChange={(e) => this.setState({mmyy: e.target.value})}/>
            <Input
              style={{width: '30%'}}
              className="aw-input--control aw-input--control-large aw-input--left "
              type="number"
              placeholder="CVV"
              onChange={(e) => this.setState({cvv: e.target.value})}/>

            </FormGroup>

            <Input
              className="aw-input--control aw-input--control-large aw-input--left "
              type="number"
              placeholder="Billing zipcode"
              onChange={(e) => this.setState({zip: e.target.value})}/>

            <FormGroup check className="my-2">
              <Label check>
                <Input type="checkbox" />{' '}
                Make defult payment card
              </Label>
            </FormGroup>

        </ModalBody>

        <ModalBody className="modal-body-bordertop">
          <button type="button" onClick={e=> this.handleSubmit(e)} className={buttonClass}>SAVE</button>
          { this.state.invalidText ? <span className="text-error text-center text-block">{this.state.invalidText}</span>: null}
        </ModalBody>

      </form>
            :null}

      { this.state.mode === 'edit' ?
          <ModalBody className="modal-body-bordertop">

            <ul className="list-payments list-payments--noborder">
              <li>
                <span className="payments--card">{this.state.cardnumber}</span>
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
