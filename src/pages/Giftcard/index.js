import React, { useState, useEffect } from 'react';
import qs from 'qs';

import { logPageView } from 'services/google-analytics';
import { getErrorMessage, getErrorParam } from 'utils';

// API
import { purchaseGiftCard } from 'api/promocode';

// Custom Components
import Head from 'common/Head';
import PaymentMethods from 'pages/Giftcard/PaymentMethods';

// Formik
import { Form, Formik, useFormikContext } from 'formik';
import CurrencyInput from 'common/FormikComponents/NonRenderPropAPI/CurrencyInput';
import TextField from 'common/FormikComponents/NonRenderPropAPI/TextInput';
import * as Yup from 'yup';

// Material UI
import { Box, Card, Container, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Styled components
import { HelperText } from 'styled-component-lib/HelperText';
import { Label as InputLabel } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import styled from 'styled-components';

function GiftCardPage(props) {
  const { routing, user: userStore } = useStores();

  useEffect(() => {
    // Store page view in google analytics
    const { location } = routing;
    logPageView(location.pathname);

    handleGiftcardRedirect();
  }, []);

  function handleGiftcardRedirect() {
    const queryParams = qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });
    const { giftcard } = queryParams;

    if (giftcard) {
      userStore.giftCardPromo = giftcard;
      routing.push('/main');
    }
  }

  return (
    <Container maxWidth="md">
      <Head
        title="Gift Card"
        description="Treat your loved ones to a zero-waste Wally Shop giftcard."
      />
      <Box py={4}>
        <GiftForm />
      </Box>
    </Container>
  );
}

export default GiftCardPage;

const GiftForm = observer(() => {
  const [purchaseResult, setPurchaseResult] = useState(undefined);
  const { loading, snackbar: snackbarStore, user: userStore } = useStores();
  const { user } = userStore;

  // Stripe
  const elements = useElements();
  // Used to control state of card input on error.
  const [paymentError, setPaymentError] = useState(false);
  const stripe = useStripe();

  const handleSubmit = async (values, resetForm, setFieldError) => {
    try {
      loading.show();

      var auth;

      // Guest checkout
      if (!user) {
        // Makes sure stripe has loaded before trying to submit.
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        var stripeToken = await stripe.createToken(cardElement);
        if (stripeToken.error) {
          throw stripeToken;
        }
        auth = {};
      } else {
        auth = userStore.getHeaderAuth();
      }

      // Convert amount to minimum denomination
      const amount = values.amount * 100;
      const data = {
        ...values,
        amount,
        stripeToken: stripeToken ? stripeToken.token.id : undefined,
      };
      await purchaseGiftCard(data, auth).then(({ data }) => {
        const { promo_code } = data;
        const { recipient, sender } = values;
        const successMessage =
          'We sent a receipt of your purchase to ' +
          sender +
          ' and we sent your gift to ' +
          recipient +
          '. Your loved one can use code ' +
          promo_code +
          ' to redeem their gift, either on their account or during checkout.';
        setPurchaseResult({ promoCode: promo_code, successMessage });
        resetForm();
      });
    } catch (error) {
      const message = getErrorMessage(error);
      const param = getErrorParam(error);

      if (message && param) {
        // Common errors from backend, including stripe errors

        // For authenticated customers, paymentId field will exist
        if (user) setFieldError(param, message);
        // For guest users, there isn't a field we can control, so use state
        else setPaymentError(message);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        // Validation errors from backend
        const { errors } = error.response.data;
        for (let e of errors) {
          if (e.msg && e.param) {
            setFieldError(e.param, e.msg);
          }
        }
      } else if (error.error && error.error.message) {
        // Stripe elements error
        const { message } = error.error;
        setPaymentError(message);
      } else {
        snackbarStore.openSnackbar('Giftcard purchase failed.', 'error');
      }
    } finally {
      loading.hide();
    }
  };

  return (
    <Card>
      {purchaseResult ? (
        <Box p={3}>
          <Typography variant="h1" gutterBottom>
            Thank you for your purchase.
          </Typography>
          <Typography variant="h2" gutterBottom>
            {purchaseResult.promoCode} is your gift code.
          </Typography>
          <Typography gutterBottom>{purchaseResult.successMessage}</Typography>
        </Box>
      ) : (
        <Box p={3}>
          <Typography variant="h1" gutterBottom>
            Do you, with reusables
          </Typography>
          <Typography gutterBottom>
            Treat your loved ones to a zero-waste Wally Shop giftcard.
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              amount: '10',
              message: undefined,
              paymentId: user ? user.preferred_payment : undefined,
              recipient: '',
              sender: '',
            }}
            validationSchema={Yup.object({
              amount: Yup.number()
                .integer('Amount must be a whole number')
                .min(10, "Amount can't be less than $10")
                .max(500, "Amount can't exceed $500")
                .required("Amount can't be blank"),
              message: Yup.string(),
              paymentId: Yup.string(),
              recipient: Yup.string()
                .email('Email address is invalid')
                .required('The field is required'),
              sender: Yup.string()
                .email('Email address is invalid')
                .required('The field is required'),
              stripeToken: Yup.string(),
            })}
            onSubmit={(values, { setFieldError, setSubmitting, resetForm }) => {
              handleSubmit(values, resetForm, setFieldError);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box my={4}>
                  <Grid container spacing={2} justify="center">
                    <Grid item xs={12}>
                      <Amount />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="To"
                        name="recipient"
                        type="email"
                        placeholder="Enter recipient's email address"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="From"
                        name="sender"
                        type="email"
                        placeholder="Enter your email address"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Your message"
                        name="message"
                        type="textarea"
                        multiline
                        placeholder="Write a message for your recipient (optional)"
                        variant="outlined"
                      />
                    </Grid>

                    {/* If user is guest, render card input */}
                    <Grid item xs={12}>
                      {!user ? <CardInput paymentError={paymentError} /> : null}
                      {user ? <PaymentMethods name="paymentId" /> : null}
                    </Grid>
                    {/* If user has account, use their stored payment methods */}
                    <Grid item>
                      <PrimaryWallyButton
                        disabled={isSubmitting}
                        fullWidth
                        type="submit"
                      >
                        Purchase Gift Card
                      </PrimaryWallyButton>
                    </Grid>
                  </Grid>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Card>
  );
});

const AmountInputWrapper = styled(Grid)`
  margin-top: 16px;
  @media only screen and (max-width: 768px) {
    order: 2;
  }
`;

const AmountSelectWrapper = styled(Grid)`
  margin-top: 16px;
  padding-left: 16px;
  @media only screen and (max-width: 768px) {
    padding-left: 0;
  }
`;

function Amount() {
  const { setFieldValue } = useFormikContext();
  return (
    <Grid item xs={12}>
      <InputLabel>Choose or enter an amount</InputLabel>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Enter whole amount from $10 to $500 USD
      </Typography>
      <Grid container>
        <AmountInputWrapper item xs={12} md={6} lg={5}>
          <CurrencyInput
            label="Gift Card Amount"
            name="amount"
            variant="outlined"
          />
        </AmountInputWrapper>
        <AmountSelectWrapper item xs={12} md={6} lg={7}>
          <Box my={1}>
            <PrimaryWallyButton
              onClick={() => setFieldValue('amount', 15)}
              size="small"
              style={{ marginRight: '8px' }}
            >
              $15
            </PrimaryWallyButton>
            <PrimaryWallyButton
              onClick={() => setFieldValue('amount', 25)}
              size="small"
              style={{ marginRight: '8px' }}
            >
              $25
            </PrimaryWallyButton>
            <PrimaryWallyButton
              onClick={() => setFieldValue('amount', 50)}
              size="small"
              style={{ marginRight: '8px' }}
            >
              $50
            </PrimaryWallyButton>
            <PrimaryWallyButton
              onClick={() => setFieldValue('amount', 100)}
              size="small"
              style={{ marginRight: '8px' }}
            >
              $100
            </PrimaryWallyButton>
          </Box>
        </AmountSelectWrapper>
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
      <Typography variant="h3" gutterBottom>
        Payment
      </Typography>
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
