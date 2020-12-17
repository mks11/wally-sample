import React, { useEffect } from 'react';

// Cookies
import { useCookies } from 'react-cookie';

// Custom Components
import CheckoutFlowBreadcrumbs from 'common/CheckoutFlowBreadcrumbs';
import ShippingAddresses from './ShippingAddresses';
import ShippingOptions from './ShippingOptions';

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

const Shipping = observer(({ breadcrumbs, location }) => {
  const [cookies, setCookie] = useCookies([
    'addressId',
    'shippingServiceLevel',
  ]);
  const { checkout, routing, user: userStore } = useStores();
  const { user } = userStore;
  let { addressId, shippingServiceLevel } = cookies;
  var preferredAddresId;
  // Form state is populated in the following order:
  // 1. Via addressId cookie. This cookie is set when progressing to next page
  // or when a guest submits their address.

  // 2. Via user's preferred_address, if no addressId cookie exists yet.

  // 3. empty string when guest customers visit page for first time or if authed
  // customer doesn't have any addresses
  if (!addressId && user && user.preferred_address) {
    preferredAddresId = user.preferred_address;
  }

  const handleSaveAddress = (value) => {
    setCookie('addressId', value, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  };

  const handleSaveShippingMethod = (value) => {
    setCookie('shippingServiceLevel', value, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  };

  useEffect(() => {
    // Store page view in google analytics
    logPageView(location.pathname);
  }, []);

  useEffect(() => {
    if (checkout.cart && !checkout.cart.cart_items.length) {
      routing.push('/checkout/cart');
    }
  }, [checkout.cart]);

  return (
    <Container maxWidth="md">
      <CheckoutFlowBreadcrumbs breadcrumbs={breadcrumbs} location={location} />
      <Card style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
        <Box p={2}>
          <Formik
            initialValues={{
              addressId: addressId || preferredAddresId || '',
              shippingServiceLevel: shippingServiceLevel || 'ups_ground',
            }}
            validationSchema={Yup.object({
              addressId: Yup.string().required(
                'You must enter your shipping address.',
              ),
              shippingServiceLevel: Yup.string().required(
                'You must select a shipping method.',
              ),
            })}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              handleSaveAddress(values.addressId);
              handleSaveShippingMethod(values.shippingServiceLevel);
              setSubmitting(false);
              routing.push('/checkout/payment');
            }}
          >
            <Form>
              {userStore.user && (
                <ShippingAddresses
                  onSave={handleSaveAddress}
                  name="addressId"
                />
              )}
              <ShippingOptions
                name="shippingServiceLevel"
                onSave={handleSaveShippingMethod}
              />
              <Box display="flex" justifyContent="center">
                <PrimaryWallyButton type="submit">
                  Continue to Payment
                </PrimaryWallyButton>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Card>
    </Container>
  );
});

export default Shipping;
