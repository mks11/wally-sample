import React, { useEffect } from 'react';

// Cookies
import { useCookies } from 'react-cookie';

// Custom Components
import CheckoutFlowBreadcrumbs from 'common/CheckoutFlowBreadcrumbs';
import PaymentOptions from './PaymentOptions';

// Formik
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Material UI
import { Box, Card, Container } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services
import { logPageView } from 'services/google-analytics';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

const Payment = observer(({ breadcrumbs, location }) => {
  const [cookies, setCookie] = useCookies([
    'addressId',
    'paymentId',
    'shippingServiceLevel',
  ]);
  const { checkout, routing, user: userStore } = useStores();
  const { user } = userStore;

  useEffect(() => {
    logPageView(location.pathname);
  }, []);

  useEffect(() => {
    if (checkout.cart && !checkout.cart.cart_items.length) {
      routing.push('/checkout/cart');
    }
  }, [checkout.cart]);

  let { addressId, paymentId, shippingServiceLevel } = cookies;
  if (!addressId || !shippingServiceLevel) {
    routing.push('/checkout/shipping');
  }

  var preferredPaymentId;

  // Form state is populated in the following order:
  // 1. Via paymentId cookie. This cookie is set when progressing to next page
  // or when a guest submits their payment info.

  // 2. Via user's preferred_payment, if no paymentId cookie exists yet.

  // 3. empty string when guest customers visit page for first time or if authed
  // customer doesn't have any payment methods saved.
  if (!paymentId && user && user.preferred_payment) {
    preferredPaymentId = user.preferred_payment;
  }

  const handleSavePayment = (value) => {
    setCookie('paymentId', value, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  };

  return (
    <Container maxWidth="md">
      <CheckoutFlowBreadcrumbs breadcrumbs={breadcrumbs} location={location} />
      <Card style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
        <Box p={2}>
          <Formik
            initialValues={{
              paymentId: paymentId || preferredPaymentId || '',
            }}
            validationSchema={Yup.object({
              paymentId: Yup.string().required(
                'You must enter a payment method.',
              ),
            })}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              handleSavePayment(values.paymentId);
              setSubmitting(false);
              routing.push('/checkout/review');
            }}
          >
            <Form>
              {userStore.user && (
                <PaymentOptions onSave={handleSavePayment} name="paymentId" />
              )}
              <Box display="flex" justifyContent="center">
                <PrimaryWallyButton type="submit">
                  Continue to Place Order
                </PrimaryWallyButton>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Card>
    </Container>
  );
});

export default Payment;
