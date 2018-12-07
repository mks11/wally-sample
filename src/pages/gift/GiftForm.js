import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import AmountGroup from './AmountGroup';
import { validateEmail } from '../../utils'
import PaymentSelect from '../../common/PaymentSelect'

class GiftForm extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      customGiftAmount: false,
      lockPayment: false,

      giftAmount: '',
      giftPayment: null,
      giftTo: '',
      giftFrom: '',
      giftMessage: '',

      successMessage: null,
      errorMessage: null,
      formIsValid: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(!prevState.giftFrom && nextProps.giftFrom !== prevState.giftFrom){
      return {
        giftFrom: nextProps.giftFrom,
      }
    }
    else return prevState
  }

  validateForm = ({ beforeSend = false }) => {
    const {
      giftTo,
      giftFrom,
      giftAmount,
      lockPayment
    } = this.state

    if (beforeSend) {
      if (!giftAmount.length) {
        this.setState({
          errorMessage: 'Please select the amount',
          formIsValid: false,
        })
        return
      }

      if (!lockPayment) {
        this.setState({
          errorMessage: 'Please select payment',
          formIsValid: false,
        })
        return
      }
  
      if (!validateEmail(giftTo) || !validateEmail(giftFrom)) {
        const errorMessage = `Invalid ${!validateEmail(giftTo) ? 'recipient' : 'sender'} email`
        this.setState({
          errorMessage,
          formIsValid: false,
        })
        return
      }
      
      this.setState({ formIsValid: true })
    } else {
      if (giftAmount.length && giftTo.length && giftFrom.length) {
        this.setState({ formIsValid: true })
      }
    }
  }

  handlePaymentSubmit = (lock, selectedPayment) => {
    this.setState({
      lockPayment: lock,
      giftPayment: selectedPayment,
    })
  }

  handleGiftCheckoutSubmit = e => {
    const { onSubmit } = this.props
    const {
      giftAmount,
      giftPayment,
      giftTo,
      giftFrom,
      giftMessage,
      formIsValid,
    } = this.state

    this.validateForm({ beforeSend: true })
    
    formIsValid && onSubmit && onSubmit({
      amount: giftAmount,
      payment_id: giftPayment,
      recipient: giftTo,
      sender: giftFrom,
      message: giftMessage,
    })
    
    e.preventDefault()
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value.toString(),
      formIsValid: false,
      errorMessage: null,
    })
  }

  handleAmountChange = value => {
    this.setState({
      customGiftAmount: false,
      giftAmount: value.toString(),
      formIsValid: false,
      errorMessage: null,
    })
  }

  handleCustomAmounClick = () => {
    this.setState({ customGiftAmount: true })
  }

  render() {
    const {
      customGiftAmount,
      errorMessage,
      successMessage,
      formIsValid,
      lockPayment,
      giftFrom,
    } = this.state
    const {
      onAddPayment,
      userPayment,
      userPreferredPayment,
      userGuest,
      customErrorMsg,
    } = this.props

    return (
      <div className="gift-card-form">
        <FormGroup row>
          <Label for="giftAmount" sm={3} className="text-md-right">Amount</Label>
          <Col sm={9}>
            <AmountGroup
              amountClick={this.handleAmountChange}
              customClick={this.handleCustomAmounClick}
            />
            {
              customGiftAmount
                ? (
                  <Input
                    type="number"
                    name="giftAmount"
                    id="giftAmount"
                    onChange={this.handleInputChange}
                    onBlur={this.validateForm}
                  />
                ) : null
            }
          </Col>
        </FormGroup>
        <FormGroup row >
          <Label sm={3} className="text-md-right">Credit Card</Label>
          <Col sm={9}>
            <PaymentSelect
              {...{
                lockPayment,
                userPayment,
                userPreferredPayment,
                onAddPayment,
                onSubmitPayment: this.handlePaymentSubmit,
                userGuest,
              }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="giftTo" sm={3} className="text-md-right">To</Label>
          <Col sm={9}>
            <Input
              type="email"
              name="giftTo"
              id="giftTo"
              placeholder="Enter recipient's email address"
              onChange={this.handleInputChange}
              onBlur={this.validateForm}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="giftFrom" sm={3} className="text-md-right">From</Label>
          <Col sm={9}>
            <Input
              type="email"
              name="giftFrom"
              id="giftFrom"
              value={giftFrom}
              placeholder="Enter your email address"
              onChange={this.handleInputChange}
              onBlur={this.validateForm}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="giftMessage" sm={3} className="text-md-right">Your message</Label>
          <Col sm={9}>
            <Input
              type="textarea"
              name="giftMessage"
              id="giftMessage"
              placeholder="Write a message for your recipient (optional)"
              onChange={this.handleInputChange}
              onBlur={this.validateForm}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 9, offset: 3 }}>
            <Button
              className={`gift-submit ${formIsValid ? 'active' : ''}`}
              onClick={this.handleGiftCheckoutSubmit}
            >Purchase Gift Card</Button>
            {errorMessage || customErrorMsg && <div className="text-error text-center mt-2">{errorMessage || customErrorMsg}</div>}
            {successMessage && <div className="text-success text-center mt-2">{successMessage}</div>}
          </Col>
        </FormGroup>
      </div>
    )
  }
}

export default GiftForm;
