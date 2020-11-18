import React, { useState } from 'react';

// MobX
import { useStores } from 'hooks/mobx';

// Stripe
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

// Components
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Checkbox from 'common/FormikComponents/NonRenderPropAPI/Checkbox';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { HelperText } from 'styled-component-lib/HelperText';

// TODO style the input
function CardInput({ elements, stripe }) {
  const [paymentError, setPaymentError] = useState(false);
  const { user: userStore, modalV2 } = useStores();
  const theme = useTheme();
  const errorColor = theme.palette.error.main;
  const handleSubmit = async (values) => {
    if (!stripe || !elements) {
      return;
    }
    try {
      const cardElement = elements.getElement(CardElement);
      const payload = await stripe.createToken(cardElement);
      if (payload.error) {
        throw payload;
      }
      await userStore.savePayment({
        isPreferredPayment: values.isPreferredPayment,
        stripeToken: payload.token.id,
      });
      modalV2.close();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.message
      ) {
        const { message } = error.response.data.error;
        setPaymentError(message);
      } else {
        setPaymentError('Failed to add new card.');
      }
    }
  };

  return (
    <Formik
      initialValues={{ isPreferredPayment: false }}
      validationSchema={Yup.object({ isPreferredPayment: Yup.bool() })}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box
            p={2}
            border={
              paymentError ? `1px solid ${errorColor}` : '1px solid black'
            }
            borderRadius="4px"
          >
            <CardElement />
          </Box>
          <HelperText error={paymentError ? true : false}>
            {paymentError ? paymentError : ' '}
          </HelperText>
          <Box pb={2}>
            <Checkbox
              label="Make default payment method"
              name="isPreferredPayment"
              color="primary"
            />
          </Box>
          <PrimaryWallyButton
            variant="outlined"
            type="submit"
            disabled={isSubmitting}
          >
            Add New Card
          </PrimaryWallyButton>
        </Form>
      )}
    </Formik>
  );
}

const StripeCardInputSmall = (props) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <CardInput elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

export default StripeCardInputSmall;
