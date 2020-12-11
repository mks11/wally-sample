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
import { Box, Container } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

const Shipping = observer(({ breadcrumbs, location }) => {
  const [cookies, setCookie] = useCookies(['addressId']);
  const { checkout, routing, user: userStore } = useStores();
  const { user } = userStore;
  let addressId = cookies['addressId'];
  var preferredAddresId;
  let shippingServiceLevel = cookies['shippingServiceLevel'];

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
      path: '/checkout',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
  };

  const handleSaveShippingMethod = (value) => {
    setCookie('shippingServiceLevel', value, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/checkout',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
  };

  useEffect(() => {
    if (checkout.cart && !checkout.cart.cart_items.length) {
      routing.push('/checkout/cart');
    }
  }, [checkout.cart]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <CheckoutFlowBreadcrumbs
          breadcrumbs={breadcrumbs}
          location={location}
        />
      </Box>
      <Box my={4}>
        <Formik
          initialValues={{
            addressId: addressId || preferredAddresId || '',
            shippingServiceLevel: shippingServiceLevel || '',
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
            // Ensure UI is synchronized with cookies in case user doesn't
            // open the address or shipping method dropdown
            // to press save when using preferred settings
            if (!addressId && values.addressId) {
              handleSaveAddress(values.addressId);
            }

            if (!shippingServiceLevel && values.shippingServiceLevel) {
              handleSaveAddress(values.values.shippingServiceLevel);
            }

            setSubmitting(false);
            routing.push('/checkout/payment');
          }}
        >
          <Form>
            {userStore.user && (
              <ShippingAddresses onSave={handleSaveAddress} name="addressId" />
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
    </Container>
  );
});

export default Shipping;
