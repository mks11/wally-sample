import React, { useState, useEffect } from 'react';
import qs from 'qs';

import { logPageView } from 'services/google-analytics';

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
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Styled components
import { HelperText } from 'styled-component-lib/HelperText';
import { Label as InputLabel } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

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
            <GiftForm />
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default GiftCardPage;

const GiftForm = observer(() => {
  const { loading, snackbar: snackbarStore, user: userStore } = useStores();
  const { user } = userStore;

  // Stripe
  const elements = useElements();
  // Used to control state of card input on error.
  const [paymentError, setPaymentError] = useState(false);
  const stripe = useStripe();

  const handleSubmit = async (values) => {
    try {
      loading.show();
      // Convert amount to minimum denomination
      const amount = values.amount * 100;
      var stripeToken;

      // TODO: REMOVE ONCE FINISHED
      console.log(values);
      console.log(amount);

      // Guest checkout
      if (!user) {
        // Makes sure stripe has loaded before trying to submit.
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        stripeToken = await stripe.createToken(cardElement);
        if (stripeToken.error) {
          throw stripeToken;
        }
      }
      const data = { amount, ...values, stripeToken };
      const res = await purchaseGiftCard(data);
      console.log(res);
    } catch (error) {
      // TODO: Also handle stripe errors from backend
      // Stripe elements error
      if (error.error && error.error.message) {
        const { message } = error.error;
        setPaymentError(message);
      } else {
        snackbarStore.openSnackbar('Giftcard purchase failed.', 'error');
      }
    } finally {
      loading.hide();
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
        message: 'foo',
        paymentId: user ? user.preferred_payment : '',
        recipient: 'foo@bar.com',
        sender: 'bar@baz.com',
      }}
      // TODO: Implement Yup validation
      validationSchema={Yup.object({
        amount: Yup.number()
          .required("Amount can't be blank")
          .min(10, "Amount can't be less than $10")
          .max(500, "Amount can't exceed $500"),
        // TODO: ADD VALIDATION FOR message, paymentId, recipient, sender
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box my={4}>
            <Grid container spacing={4}>
              <Amount />

              {/* TODO: REPLACE ANY NON MATERIAL UI COMPONENTS START */}
              {/* TODO: REPLACE NAMES WITH THE NAMES OF THE FORMIK VALUES START */}
              <Grid item>
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
              </Grid>
              <Grid item>
                <FormGroup row>
                  <Label for="giftFrom" sm={3} className="text-md-right">
                    From
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="email"
                      name="giftFrom"
                      id="giftFrom"
                      placeholder="Enter your email address"
                    />
                  </Col>
                </FormGroup>
              </Grid>
              <Grid item>
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
              </Grid>
              {/* TODO: REPLACE ANY NON MATERIAL UI COMPONENTS END */}
              {/* TODO: REPLACE NAMES WITH THE NAMES OF THE FORMIK VALUES END */}

              {/* If user is guest, render card input */}
              <Grid item xs={12}>
                {!user ? <CardInput paymentError={paymentError} /> : null}
                {user ? <PaymentMethods name="paymentId" /> : null}
              </Grid>
              {/* If user has account, use their stored payment methods */}
              <Grid item xs={12}>
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
  );
});

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
