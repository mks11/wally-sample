import React from 'react';
import {render} from 'react-dom';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import type {InjectedProps} from 'react-stripe-elements';

import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  PaymentRequestButtonElement,
  IbanElement,
  IdealBankElement,
  StripeProvider,
  Elements,
  injectStripe,
} from 'react-stripe-elements';

const handleBlur = () => {
  console.log('[blur]');
};
const handleClick = () => {
  console.log('[click]');
};
const handleFocus = () => {
  console.log('[focus]');
};
const handleReady = () => {
  console.log('[ready]');
};

const createOptions = (fontSize: string, padding: ?string) => {
  return {
    style: {
      base: {
        border: '1px solid #000',
        fontSize:'18px',
        color: '#000',
        fontFamily: 'Circe',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? {padding} : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _SplitForm extends React.Component<InjectedProps & {fontSize: string}> {

  state = {
    invalidText: '',
    cardnumber: false,
    mmyy: false,
    cvc: false,
    zip: false
  }

  handleChange = (change) => {
    if (!change) return

    let changed = {}
    switch(change.elementType) {
      case 'cardNumber': 
        changed = {cardnumber: change.complete}
        break
      case 'cardExpiry': 
        changed = {mmyy: change.complete}
        break
      case 'cardCvc': 
        changed = {cvc: change.complete}
        break
      case 'postalCode': 
        changed = {zip: change.complete}
        break
    }
    this.setState(changed)
  };


  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      // this.props.stripe.createSource()
      this.props.stripe
        .createToken()
        .then((payload) => {
          if (payload.error) {
            this.setState({invalidText: payload.error.message})
          }

          this.props.addPayment()
          // console.log('[token]', payload))
        }).catch((e) => {
          console.log('e', e)
        })
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };



  render() {

    let buttonClass = 'btn btn-main my-3'
    if (this.state.cardnumber && this.state.cvc && this.state.mmyy && this.state.zip) {
      buttonClass += ' active'
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <FormGroup className="input-merged">
              <CardNumberElement
                className="card-element-input w-60"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                placeholder="Card Number"
                {...createOptions(this.props.fontSize)}
              />
              <CardExpiryElement
                className="card-element-input w-20"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(this.props.fontSize)}
              />
              <CardCVCElement
                className="card-element-input w-20"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={handleReady}
                {...createOptions(this.props.fontSize)}
              />

          </FormGroup>
          <PostalCodeElement
            className="card-element-input"
            placeholder="Billing zipcode"
            onBlur={handleBlur}
            onChange={this.handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />

        <FormGroup check className="my-4">
          <Label check>
            <Input type="checkbox" />{' '}
            Make default payment card
          </Label>
        </FormGroup>
      </ModalBody>

      <ModalBody className="modal-body-bordertop">
        <button type="submit" className={buttonClass}>SAVE</button>
        { this.state.invalidText ? <span className="text-error text-center text-block">{this.state.invalidText}</span>: null}
      </ModalBody>
    </form>
  </div>
    );
  }
}
const SplitForm = injectStripe(_SplitForm);

export default SplitForm
