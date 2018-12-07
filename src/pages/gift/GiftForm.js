import React, { Component } from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import AmountGroup from './AmountGroup';
import { validateEmail } from '../../utils'

class GiftForm extends Component {
  constructor(props) {
    super(props)

    const { giftFrom } = this.props
    
    this.state = {
      customGiftAmount: false,

      giftAmount: '',
      giftTo: '',
      giftFrom: giftFrom || '',
      giftMessage: '',

      successMessage: null,
      errorMessage: null,
      formIsValid: false,
    }
  }

  formStructure = () => {
    return {
      giftAmount: {
        label: 'Amount',
        value: this.state.giftAmount,
        type: 'text',
        placeholder: ''
      },
      payment: {
        label: 'Credit Card',
      },
      giftTo: {
        label: 'To',
        value: this.state.giftTo,
        type: 'email',
        placeholder: 'Enter recipient\'s email address'
      },
      giftFrom: {
        label: 'From',
        value: this.state.giftFrom,
        type: 'email',
        placeholder: 'Enter your email address'
      },
      giftMessage: {
        label: 'Your Message',
        value: this.state.giftMessage,
        type: 'textarea',
        placeholder: 'Write a message for your recipient (optional)',
      }
    }
  }

  validateForm = ({ beforeSend = false }) => {
    const { giftTo, giftFrom, giftAmount } = this.state

    if (beforeSend) {
      if (!giftAmount.length ) {
        this.setState({
          errorMessage: 'Please select the amount',
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

  handleGiftCheckoutSubmit = e => {
    const { onSubmit } = this.props
    const {
      giftAmount,
      giftTo,
      giftFrom,
      giftMessage,
      formIsValid,
    } = this.state

    this.validateForm({ beforeSend: true })
    
    formIsValid && onSubmit && onSubmit({
      amount: giftAmount,
      to: giftTo,
      from: giftFrom,
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
    } = this.state
    const structure = this.formStructure()

    return (
      <Form onSubmit={this.handleGiftCheckoutSubmit}>
        {
          Object.keys(structure).map(key => {
            let innerComponent = null

            switch(key) {
              case 'giftAmount':
                innerComponent = (
                  <React.Fragment>
                    <AmountGroup
                      amountClick={this.handleAmountChange}
                      customClick={this.handleCustomAmounClick}
                    />
                    {
                      customGiftAmount
                        ? (
                          <Input
                            type={structure[key].type}
                            name={key}
                            id={key}
                            value={structure[key].value}
                            placeholder={structure[key].placeholder}
                            onChange={this.handleInputChange}
                            onBlur={this.validateForm}
                          />
                        ) : null
                    }
                  </React.Fragment>
                )
                break;
              case 'payment':
                break;
              default:
                innerComponent = (
                  <Input
                    type={structure[key].type}
                    name={key}
                    id={key}
                    value={structure[key].value}
                    placeholder={structure[key].placeholder}
                    onChange={this.handleInputChange}
                    onBlur={this.validateForm}
                  />
                )
                break;
            }

            return (
              <FormGroup row key={key}>
                <Label for={key} sm={3} className="text-md-right">{structure[key].label}</Label>
                <Col sm={9}>
                  {innerComponent}
                </Col>
              </FormGroup>
            )
          })
        }
        <FormGroup row>
          <Col sm={{ size: 9, offset: 3 }}>
            <Button className={`gift-submit ${formIsValid ? 'active' : ''}`}>Purchase Gift Card</Button>
            {errorMessage && <div className="text-error text-center mt-2">{errorMessage}</div>}
            {successMessage && <div className="text-success text-center mt-2">{successMessage}</div>}
          </Col>
        </FormGroup>
      </Form>
    )
  }
}

export default GiftForm;
