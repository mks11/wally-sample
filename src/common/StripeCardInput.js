import React, { useState } from 'react';

// API
import { createPaymentMethod } from 'api/payment';

// Material ui
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { useStores } from 'hooks/mobx';

// Stripe
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

// Components
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Checkbox from 'common/FormikComponents/NonRenderPropAPI/Checkbox';

// Styled Components
import { ActivityButton } from 'styled-component-lib/Buttons';
import { HelperText } from 'styled-component-lib/HelperText';

function CardInput({ elements, onAdd, stripe }) {
  const [paymentError, setPaymentError] = useState(false);
  const { user: userStore, modalV2 } = useStores();
  const theme = useTheme();
  const errorColor = theme.palette.error.main;
  const handleSubmit = async (values, { setSubmitting }) => {
    if (!stripe || !elements) {
      return;
    }
    try {
      const cardElement = elements.getElement(CardElement);
      const payload = await stripe.createToken(cardElement);
      if (payload.error) {
        throw payload;
      }
      const auth = userStore.getHeaderAuth();
      const {
        data: { paymentMethod, user },
      } = await createPaymentMethod(
        {
          isPreferredPayment: values.isPreferredPayment,
          stripeToken: payload.token.id,
        },
        auth,
      );
      userStore.setUserData(user);
      onAdd && onAdd(paymentMethod._id);
      setSubmitting(false);
      modalV2.close();
    } catch (error) {
      setSubmitting(false);
      if (
        // Stripe errors from backend
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.message
      ) {
        const { message } = error.response.data.error;
        setPaymentError(message);
      } else if (
        // Stripe payload errors
        error &&
        error.error &&
        error.error.message
      ) {
        const { message } = error.error;
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
      onSubmit={(values, actions) => {
        handleSubmit(values, actions);
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
          <ActivityButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Add New Card
          </ActivityButton>
        </Form>
      )}
    </Formik>
  );
}

const StripeCardInput = (props) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <CardInput elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

export default StripeCardInput;
