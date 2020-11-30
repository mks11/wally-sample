import React, { useEffect, useState } from 'react';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';
import CurrencyInput from 'react-currency-input-field';
import AmountGroup from 'common/AmountGroup';
import PaymentSelect from 'common/PaymentSelect';

function GiftForm(props) {
  const [customGiftAmount, setCustomGiftAmount] = useState(false);
  const [lockPayment, setLockPayment] = useState(false);

  const [giftAmount, setGiftAmount] = useState('');
  const [giftPayment, setGiftPayment] = useState(null);
  const [giftTo, setGiftTo] = useState('');
  const [giftFrom, setGiftFrom] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (!giftFrom && props.giftFrom !== giftFrom) {
      setGiftFrom(props.giftFrom);
    }
  }, [props.giftFrom, giftFrom]);

  const handlePaymentSubmit = (lock, selectedPayment) => {
    setLockPayment(lock);
    setGiftPayment(selectedPayment);
  };

  const handleAddPayment = (data) => {
    const { onAddPayment, userGuest } = props;
    onAddPayment && onAddPayment(data);

    if (data) {
      setLockPayment(userGuest);
    }
  };

  const handleGiftCheckoutSubmit = (e) => {
    const { onSubmit } = props;

    const giftAmountStr = giftAmount.replace('$', '');
    const giftNumberAmount = parseFloat(giftAmountStr).toFixed(2) * 100;

    formIsValid &&
      onSubmit &&
      onSubmit({
        amount: giftNumberAmount,
        payment_id: giftPayment === 'guestuser_id' ? null : giftPayment,
        recipient: giftTo,
        sender: giftFrom,
        message: giftMessage,
      });

    e.preventDefault();
  };

  /* TODO 
  leaving the commented as this is to replace with Formik
  
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.toString(),
      formIsValid: false,
      errorMessage: null,
    });
  };
  */

  const handleAmountChange = (value) => {
    setCustomGiftAmount(false);
    setGiftAmount(value.toString());
    setFormIsValid(false);
    setErrorMessage(null);
  };

  const handleCustomAmounClick = () => {
    setCustomGiftAmount(true);
  };

  const {
    userPayment,
    userPreferredPayment,
    userGuest,
    customErrorMsg,
    forceSelect,
  } = props;

  return (
    <div className="gift-card-form">
      <FormGroup row>
        <Label for="giftAmount" sm={3} className="text-md-right">
          Amount
        </Label>
        <Col sm={9}>
          <AmountGroup
            amountClick={handleAmountChange}
            customClick={handleCustomAmounClick}
            values={[25, 50, 100]}
            selected={50}
            prefix="$"
            custom={true}
            product={false}
          />
          {customGiftAmount ? (
            <CurrencyInput
              allowDecimals
              className="form-control"
              id="giftAmount"
              name="giftAmount"
              prefix="$"
              value={giftAmount}
            />
          ) : null}
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label sm={3} className="text-md-right">
          Credit Card
        </Label>
        <Col sm={9}>
          <PaymentSelect
            {...{
              lockPayment,
              userPayment,
              userPreferredPayment,
              onAddPayment: handleAddPayment,
              onSubmitPayment: handlePaymentSubmit,
              userGuest,
              forceSelect,
            }}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="giftTo" sm={3} className="text-md-right">
          To
        </Label>
        <Col sm={9}>
          <Input
            type="email"
            name="giftTo"
            id="giftTo"
            placeholder="Enter recipient's email address"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="giftFrom" sm={3} className="text-md-right">
          From
        </Label>
        <Col sm={9}>
          <Input
            type="email"
            name="giftFrom"
            id="giftFrom"
            value={giftFrom}
            placeholder="Enter your email address"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="giftMessage" sm={3} className="text-md-right">
          Your message
        </Label>
        <Col sm={9}>
          <Input
            type="textarea"
            name="giftMessage"
            id="giftMessage"
            placeholder="Write a message for your recipient (optional)"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={{ size: 9, offset: 3 }}>
          <Button
            className={`gift-submit ${formIsValid ? 'active' : ''}`}
            onClick={handleGiftCheckoutSubmit}
          >
            Purchase Gift Card
          </Button>
          {(errorMessage || customErrorMsg) && (
            <div className="text-error text-center mt-2">
              {errorMessage || customErrorMsg}
            </div>
          )}
          {successMessage && (
            <div className="text-success text-center mt-2">
              {successMessage}
            </div>
          )}
        </Col>
      </FormGroup>
    </div>
  );
}

export default GiftForm;
