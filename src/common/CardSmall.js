import React from 'react';
import { Input, FormGroup, Label } from 'reactstrap';
import type {InjectedProps} from 'react-stripe-elements';

import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  injectStripe,
} from 'react-stripe-elements';

const handleBlur = () => {
  console.log('[blur]');
};
// const handleClick = () => {
//   console.log('[click]');
// };
const handleFocus = () => {
  console.log('[focus]');
};
// const handleReady = () => {
//   console.log('[ready]');
// };

const createOptions = (fontSize: string, padding: ?string) => {
  return {
    style: {
      base: {
        border: '1px solid #000',
        fontSize:'14px',
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
    zip: false,

    billing_zip: null,
    preferred_payment: false
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
        changed = {zip: change.complete, billing_zip: change.value}
        break
      default:
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
            throw payload
          }

          return this.props.addPayment({
            preferred_payment: this.state.preferred_payment,
            billing_zip: this.state.billing_zip,
            stripeToken: payload.token.id
          })
          // console.log('[token]', payload))
        }).then((data) => {
          this.setState({
            invalidText: ''
          })
          this._cardnumber.clear()
          this._cardexpiry.clear()
          this._cvc.clear()
          this._zip.clear()
        }).catch((e) => {
          console.log(e)
          if (e.response) {
            const msg = e.response.data.error.message
            this.setState({invalidText: msg})
            console.error('Failed to save payment', e)
            return
          }

          if (e.error) {
            this.setState({invalidText: e.error.message})
          }
          
        })
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };



  render() {
    const { fontSize, userGuest } = this.props

    let buttonClass = 'btn btn-main inline-round my-3'
    if (this.state.cardnumber && this.state.cvc && this.state.mmyy && this.state.zip) {
      buttonClass += ' active'
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <FormGroup className="input-merged">
              <CardNumberElement
                className="card-element-input w-40"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={(c) => this._cardnumber = c}
                placeholder="Card Number"
                {...createOptions(fontSize)}
              />
              <CardExpiryElement
                className="card-element-input w-20"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={(c) => this._cardexpiry = c}
                {...createOptions(fontSize)}
              />
              <CardCVCElement
                className="card-element-input w-20"
                onBlur={handleBlur}
                onChange={this.handleChange}
                onFocus={handleFocus}
                onReady={(c) => this._cvc = c}
                {...createOptions(fontSize)}
              />

            <PostalCodeElement
              className="card-element-input w-20"
              placeholder="Zipcode"
              onBlur={handleBlur}
              onChange={this.handleChange}
              onFocus={handleFocus}
              onReady={(c) => this._zip = c}
              {...createOptions(fontSize)}
            />

          </FormGroup>

          { !userGuest ? (
            <FormGroup check className="my-4">
              <Label check>
                <Input type="checkbox" onChange={e=>this.setState({preferred_payment: !this.state.preferred_payment})} />{' '}
                Make default payment card
              </Label>
            </FormGroup>
            ) : null
          }

        <button type="submit" className={buttonClass}>CONFIRM</button>
        { this.state.invalidText ? <span className="text-error text-block">{this.state.invalidText}</span>: null}
    </form>
  </div>
    );
  }
}
const SplitForm = injectStripe(_SplitForm);

export default SplitForm
