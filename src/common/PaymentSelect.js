import React, { Component } from 'react';
import CardSmall from './CardSmall';
import {StripeProvider, Elements} from 'react-stripe-elements'

import { STRIPE_API_KEY } from '../config'

class PaymentSelect extends Component {
  constructor(props) {
    super(props)

    const {
      forceSelect,
      userPreferredPayment,
    } = props

    this.state = {
      selectedPayment: forceSelect || userPreferredPayment,
      newPayment: false,
    }
  }

  handleSelectPayment = payment_id => {
    this.setState({
      newPayment: payment_id === "0",
      selectedPayment: payment_id,
    })
  }

  handleSubmitPayment = () => {
    const { onSubmitPayment } = this.props
    const { selectedPayment } = this.state

    if (selectedPayment) {
      onSubmitPayment && onSubmitPayment(true, selectedPayment)
    }
  }

  handleAddPayment = data => {
    const { onAddPayment } = this.props
    onAddPayment && onAddPayment(data)
    
    this.setState({ newPayment: false })
  }

  render() {
    const {
      selectedPayment,
      newPayment,
    } = this.state

    const {
      userPayment,
      userPreferredPayment,
      forceSelect,
      lockPayment,
      userGuest,
    } = this.props

    const paymentFormClass = `addPaymentForm ${!newPayment ? 'd-none' : ''}`
    const selected = forceSelect || selectedPayment

    return (
      <div className="card1">
        <div className={`card-body ${lockPayment ? 'lock' : ''}`}>
          { userPayment && userPayment.map((data, index) => {

            if (lockPayment && selected !== data._id) {
              return null
            }
            return (
              <div 
                className={`custom-control custom-radio bb1 ${data._id === selected ? 'active' : ''}`}
                key={index}>
                <input
                  type="radio"
                  id={`payment${index}`}
                  value={data._id} 
                  checked={data._id === selected}
                  name="customRadio" className="custom-control-input"
                  onChange={e => this.handleSelectPayment(data._id)}
                />
                <label className="custom-control-label" htmlFor={`payment${index}`} onClick={e=>this.handleSelectPayment(data._id)}>
                  <img src="images/card.png" alt="" /> *****{data.last4}
                </label>
                {
                  userPreferredPayment
                  && userPreferredPayment === data._id
                  && <span className="address-rbtn link-blue" style={{ top:'10px' }}>DEFAULT</span>
                }
              </div>
            )
          })}

          { !lockPayment
            ? (
              <div>
                <div 
                  className={`custom-control custom-radio bb1 ${"0" === selected ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    id="paymentAdd"
                    name="customRadio"
                    className="custom-control-input" 
                    value="0"
                    checked={selected === "0"}
                    onChange={e=>this.handleSelectPayment(selected)}/>
                  <label
                    className="custom-control-label"
                    htmlFor="paymentAdd"
                    onClick={e=>this.handleSelectPayment('0')}
                  >Add new card</label>
                </div>
                <div className={paymentFormClass}>
                  <StripeProvider apiKey={STRIPE_API_KEY}>
                    <Elements>
                      <CardSmall addPayment={this.handleAddPayment} userGuest={userGuest} />
                    </Elements>
                  </StripeProvider>
                </div>
              </div>
            ) : null
          }
          { (!lockPayment && !newPayment) && <button className="btn btn-main active" onClick={e => this.handleSubmitPayment(e)}>SUBMIT</button>}
      </div>
    </div>
    )
  }
}

export default PaymentSelect