import React, { Component, useState, useEffect } from 'react';
import qs from 'qs';

import { logPageView } from 'services/google-analytics';
import { connect } from '../utils';

import Head from '../common/Head';

import PaymentSelect from 'common/PaymentSelect';

// Formik
import { Form, Formik, useFormikContext } from 'formik';
import CurrencyInput from 'common/FormikComponents/NonRenderPropAPI/CurrencyInput';
import TextField from 'common/FormikComponents/NonRenderPropAPI/TextInput';
import * as Yup from 'yup';

// Material UI
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Reactstrap
import { Col, FormGroup, Label, Input } from 'reactstrap';

// Stripe
import {
  CardElement,
  ElementsConsumer,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Styled components
import { HelperText } from 'styled-component-lib/HelperText';
import { Label as InputLabel } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

class GiftCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeToken: null,
      selectedPayment: null,
      lockPayment: false,
      guestUserPayment: null,
      processGiftCard: false,
    };

    this.userStore = this.props.store.user;
    this.checkoutStore = this.props.store.checkout;
    this.routing = this.props.store.routing;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);

    this.handleGiftcardRedirect();

    // this.userStore.getStatus(true).then((status) => {
    //   if (status) {
    //     if (this.userStore.user.payment.length > 0) {
    //       const selectedPayment = this.userStore.user.payment.find(
    //         (d) => d._id === this.userStore.user.preferred_payment,
    //       );
    //       this.setState({ selectedPayment: selectedPayment._id });
    //     }
    //   }
    //   this.setState({ processGiftCard: true });
    // });
  }

  handleGiftcardRedirect() {
    const queryParams = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    const { giftcard } = queryParams;

    if (giftcard) {
      this.userStore.giftCardPromo = giftcard;
      this.routing.push('/main');
    }
  }

  handleAddPayment = (data) => {
    if (this.userStore.status) {
      if (data) {
        this.userStore.setUserData(data);
        this.setState({
          selectedPayment: this.userStore.user.preferred_payment,
        });
      }
    } else {
      const guestPayment = !this.userStore.status
        ? [
            {
              _id: 'guestuser_id',
              last4: data.last4,
            },
          ]
        : null;

      this.setState({
        stripeToken: data.stripeToken,
        guestUserPayment: guestPayment,
        selectedPayment: 'guestuser_id',
      });
    }
  };

  render() {
    const {
      purchaseFailed,
      guestUserPayment,
      selectedPayment,
      processGiftCard,
    } = this.state;

    const giftFrom = this.userStore.user ? this.userStore.user.email : '';
    const userPayment = this.userStore.user
      ? this.userStore.user.payment
      : guestUserPayment;
    const userPreferredPayment = this.userStore.user
      ? this.userStore.user.preferred_payment
      : null;
    const userGuest = !this.userStore.status;

    return (
      <Container maxWidth="xl">
        <Head
          title="Gift Card"
          description="Treat your loved ones to a zero-waste Wally Shop giftcard."
        />
        <Box py={4}>
          <Typography variant="h1" gutterBottom>
            Gift Card
          </Typography>
          <Card>
            <Box p={3}>
              <Typography variant="h2" gutterBottom>
                Do you, with reusables
              </Typography>
              <Typography gutterBottom>
                Treat your loved ones to a zero-waste Wally Shop giftcard.
              </Typography>
              <Divider />
              <GiftForm
                giftFrom={giftFrom}
                onAddPayment={this.handleAddPayment}
                userPayment={userPayment}
                userPreferredPayment={userPreferredPayment}
                userGuest={userGuest}
                customErrorMsg={purchaseFailed}
                forceSelect={userGuest ? selectedPayment : null}
              />
            </Box>
          </Card>
        </Box>
      </Container>
    );
  }
}

export default connect('store')(GiftCheckout);

function GiftForm({
  customErrorMsg,
  forceSelect,
  giftFrom,
  onAddPayment,
  userGuest,
  userPayment,
  userPreferredPayment,
}) {
  const elements = useElements();
  const { snackbar: snackbarStore, user: userStore } = useStores();
  const { user } = userStore;
  const [lockPayment, setLockPayment] = useState(false);
  const [giftPayment, setGiftPayment] = useState(null);
  const [paymentError, setPaymentError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const stripe = useStripe();

  const handlePaymentSubmit = (lock, selectedPayment) => {
    setLockPayment(lock);
    setGiftPayment(selectedPayment);
  };

  const handleAddPayment = (data) => {
    onAddPayment && onAddPayment(data);

    if (data) {
      setLockPayment(userGuest);
    }
  };

  const handleSubmit = async (values) => {
    // Convert amount to minimum denomination
    const amount = values.amount * 100;

    // Makes sure stripe has loaded before trying to submit.

    try {
      console.log(amount);

      // Guest checkout
      if (!user) {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const stripeToken = await stripe.createToken(cardElement);
        if (stripeToken.error) {
          throw stripeToken;
        }

        // Send token in request
      }
    } catch (error) {
      // Stripe elements error
      if (error.error && error.error.message) {
        const { message } = error.error;
        setPaymentError(message);
      } // TODO: Also handle stripe errors from backend
    }
  };

  // This is the old submit handler. Want to mimic most of it's functionality
  // But improve error handling

  // handleGiftCheckoutSubmit = (data) => {
  //   let finalData = data;
  //   if (!data.payment_id) {
  //     finalData.stripeToken = this.state.stripeToken;
  //   }

  //   this.userStore
  //     .purchaseGiftCard(finalData)
  //     .then((res) => {
  //       if (res.success) {
  //         this.routing.push('/main');
  //       } else {
  //         this.setState({ purchaseFailed: 'Gift card purchase failed' });
  //       }
  //     })
  //     .catch((e) => {
  //       const msg = !e.response.data.error
  //         ? 'Purchase failed'
  //         : e.response.data.error.message;
  //       this.setState({ purchaseFailed: msg });
  //     });
  // };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        amount: '10',
        message: '',
        paymentId: '',
        recipient: '',
        sender: '',
      }}
      // TODO: Implement Yup validation
      validationSchema={Yup.object({
        amount: Yup.number()
          .required("Amount can't be blank")
          .min(10, "Amount can't be less than $10")
          .max(500, "Amount can't exceed $500"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setTimeout(() => setSubmitting(false), 2000);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box my={4}>
            <Grid container spacing={4}>
              <Amount />
              {/* If user is guest, render card input */}
              {!user ? (
                <Grid item xs={12}>
                  <CardInput paymentError={paymentError} />
                </Grid>
              ) : null}
            </Grid>
          </Box>
          {/* <FormGroup row>
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
          </FormGroup> */}
          {/* <FormGroup row>
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
          </FormGroup> */}
          <FormGroup row>
            <Col sm={{ size: 9, offset: 3 }}>
              <PrimaryWallyButton disabled={isSubmitting} type="submit">
                Purchase Gift Card
              </PrimaryWallyButton>

              {/* TODO: This should just be handled like we normally do. */}
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
        </Form>
      )}
    </Formik>
  );
}

function Amount() {
  const { setFieldValue } = useFormikContext();
  return (
    <Grid item xs={12}>
      <InputLabel>Choose or enter an amount</InputLabel>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Enter whole amount from $10 to $500 USD
      </Typography>
      <Box mt={2}>
        <CurrencyInput
          label="Gift Card Amount"
          name="amount"
          variant="outlined"
        />
      </Box>
      <Grid container spacing={1}>
        <Grid item>
          <PrimaryWallyButton
            onClick={() => setFieldValue('amount', 15)}
            size="small"
          >
            $15
          </PrimaryWallyButton>
        </Grid>
        <Grid item>
          <PrimaryWallyButton
            onClick={() => setFieldValue('amount', 25)}
            size="small"
          >
            $25
          </PrimaryWallyButton>
        </Grid>
        <Grid item>
          <PrimaryWallyButton
            onClick={() => setFieldValue('amount', 50)}
            size="small"
          >
            $50
          </PrimaryWallyButton>
        </Grid>
        <Grid item>
          <PrimaryWallyButton
            onClick={() => setFieldValue('amount', 100)}
            size="small"
          >
            $100
          </PrimaryWallyButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

function CardInput({ paymentError }) {
  const theme = useTheme();
  const [inputColor, setInputColor] = useState('rgba(0, 0, 0, 0.2)');
  const [textColor, setTextColor] = useState(theme.palette.text.main);

  const CARD_OPTIONS = {
    style: {
      base: {
        color: textColor,
      },
    },
  };
  const errorColor = theme.palette.error.main;
  const primaryColor = theme.palette.primary.main;

  const handleFocus = () => {
    setInputColor(primaryColor);
    setTextColor(primaryColor);
  };

  return (
    <>
      <Box
        p={2}
        border={`1px solid ${paymentError ? errorColor : inputColor}`}
        borderRadius="4px"
      >
        <CardElement onFocus={handleFocus} options={CARD_OPTIONS} />
      </Box>
      <HelperText error={paymentError ? true : false}>
        {paymentError ? paymentError : ' '}
      </HelperText>
    </>
  );
}
