import React, { lazy, Suspense, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// API
import { submitOrder } from 'api/order';
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { InfoIcon } from 'Icons';

// Cookies
import { useCookies } from 'react-cookie';

// Custom Components
import Address from 'pages/Shipping/ShippingAddresses/Address';
import CheckoutFlowBreadcrumbs from 'common/CheckoutFlowBreadcrumbs';
import { CreditCard } from 'common/PaymentMethods';
import { OPTIONS, getDeliveryDates } from 'pages/Shipping/ShippingOptions';

// Forms
import ApplyPromoCodeForm from 'forms/ApplyPromoCodeForm';

// Utilities
import { logPageView, logEvent } from 'services/google-analytics';
import { formatMoney, getErrorMessage, getErrorParam } from 'utils';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Styled components
import { HelperText } from 'styled-component-lib/HelperText';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { PrimaryTextLink } from 'styled-component-lib/Links';

function Checkout({ breadcrumbs, location }) {
  // MobX state
  const {
    checkout: checkoutStore,
    loading: loadingStore,
    modal: modalStore,
    routing: routingStore,
    snackbar: snackbarStore,
    user: userStore,
  } = useStores();
  const { cart, order } = checkoutStore;
  const { flags, user } = userStore;

  // Cookies related to the checkout experience
  const [cookies, setCookie] = useCookies([
    'addressId',
    'paymentId',
    'shippingServiceLevel',
  ]);
  const { addressId, paymentId, shippingServiceLevel } = cookies;

  // Redirect if user has navigated here via the address bar
  if (!addressId || !shippingServiceLevel) {
    routingStore.push('/checkout/shipping');
  } else if (!paymentId) {
    routingStore.push('/checkout/payment');
  }

  useEffect(() => {
    if (checkoutStore.cart && !checkoutStore.cart.cart_items.length) {
      routingStore.push('/checkout/cart');
    }
  }, [checkoutStore.cart]);

  useEffect(() => {
    // Store page view in google analytics
    const { location } = routingStore;
    logPageView(location.pathname);
    // This triggers a modal if the user hasn't visited the page yet.
    // The modal explains the packaging deposit process.
    // The 'flag' is set via a local storage item.
    if (user && flags && !flags.checkoutFirst) {
      modalStore.toggleModal('checkoutfirst');
    }

    if (user && flags.checkoutFirst) {
      loadData();
    }
  }, [user, flags]);

  // TODO: Once guest experience implemented, this logic will need to change
  if (!cart || !order || !user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <CheckoutFlowBreadcrumbs breadcrumbs={breadcrumbs} location={location} />
      <Box my={4}>
        <Card elevation={1} style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
          <Box p={1}>
            <Box p={1} borderRadius="4px">
              <Box pt={2} px={1} pb={1}>
                <Typography component="h1" variant="h3" gutterBottom>
                  Review your order
                </Typography>
              </Box>
              {userStore.user && (
                <>
                  <OrderSummary />
                  <Formik
                    initialValues={{
                      addressId: addressId || '',
                      cartId: cart._id || '',
                      paymentId: paymentId || '',
                      shippingServiceLevel: shippingServiceLevel || '',
                    }}
                    validationSchema={Yup.object({
                      addressId: Yup.string().required(
                        'You must select a shipping address.',
                      ),
                      cartId: Yup.string().required(
                        "You can't make an order without a cart.",
                      ),
                      paymentId: Yup.string().required(
                        'You must select a payment method.',
                      ),
                      shippingServiceLevel: Yup.string().required(),
                    })}
                    enableReinitialize
                    onSubmit={(values, { setFieldError, setSubmitting }) => {
                      handlePlaceOrder(values, setFieldError);
                      setSubmitting(false);
                    }}
                  >
                    {({ errors, isSubmitting }) => {
                      errors = Object.values(errors);

                      return (
                        <Form>
                          <Card elevation={0}>
                            <Box my={1}>
                              <Container maxWidth="xs">
                                <PrimaryWallyButton
                                  type="submit"
                                  fullWidth
                                  disabled={isSubmitting}
                                  disableElevation
                                >
                                  Place Order
                                </PrimaryWallyButton>
                                <Box pt={1} px={2}>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    align="center"
                                  >
                                    By placing your order, you agree to be bound
                                    by the Terms of Service and Privacy Policy.
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="center">
                                  <HelperText
                                    error={errors.length ? true : false}
                                  >
                                    {errors.length ? errors[0] : ' '}
                                  </HelperText>
                                </Box>
                              </Container>
                            </Box>
                          </Card>
                        </Form>
                      );
                    }}
                  </Formik>
                </>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Container>
  );

  function clearCookies() {
    setCookie('addressId', '', { path: '/' });
    setCookie('paymentId', '', { path: '/' });
    setCookie('shippingServiceLevel', '', { path: '/' });
  }

  async function handlePlaceOrder(values, setFieldError) {
    try {
      const { addressId, cartId, paymentId, shippingServiceLevel } = values;
      const auth = userStore.getHeaderAuth();
      loadingStore.show();
      logEvent({
        category: 'Order',
        action: 'Submit Order',
      });

      const res = await submitOrder(
        {
          addressId,
          cartId,
          paymentId,
          shippingServiceLevel,
        },
        auth,
      );
      checkoutStore.clearCart(userStore.getHeaderAuth());
      clearCookies();
      routingStore.push('/orders/' + res.data.order._id);
    } catch (error) {
      let msg = getErrorMessage(error);
      let param = getErrorParam(error);

      if (msg && param) {
        setFieldError(param, msg);
      } else {
        snackbarStore.openSnackbar('Order submission failed.', 'error');
      }
    } finally {
      loadingStore.hide();
    }
  }

  async function loadData() {
    try {
      loadingStore.show();
      const auth = userStore.getHeaderAuth();
      await checkoutStore.getOrderSummary(auth);
    } catch (error) {
      snackbarStore.openSnackbar('Failed to retrieve order summary.', 'error');
    } finally {
      loadingStore.hide();
    }
  }
}

export default observer(Checkout);

const PackagingDepositInfo = lazy(() => import('modals/PackagingDepositInfo'));

const OrderSummary = observer(() => {
  const theme = useTheme();
  const { checkout, modalV2, user: userStore } = useStores();

  // Order summary state
  const { cart, order } = checkout;
  const cart_items = order && order.cart_items ? order.cart_items : [];
  const hasFreeShipping =
    order &&
    typeof order.delivery_amount === 'number' &&
    !+order.delivery_amount;
  const wasTaxed =
    order && typeof order.tax_amount === 'number' && +order.tax_amount;
  const orderTotal = order && order.total && order.total / 100;
  const hasDiscount =
    (order && order.applied_packaging_balance) ||
    order.applied_store_credit ||
    (order.applied_promo_codes && order.applied_promo_codes.length);

  // User state
  const { user } = userStore;

  // Cookies related to the checkout experience
  const [cookies] = useCookies([
    'addressId',
    'paymentId',
    'shippingServiceLevel',
  ]);
  const { addressId, paymentId, shippingServiceLevel } = cookies;

  var address, paymentMethod, shippingMethod;

  // Find user's address using id stored in cookie.
  if (user && user.addresses && addressId) {
    const { addresses } = user;
    address = addresses.find((a) => a._id.toString() === addressId);
  }

  if (shippingServiceLevel) {
    shippingMethod = OPTIONS.find((o) => o.value === shippingServiceLevel);
  }

  if (user && user.payment && paymentId) {
    const { payment } = user;
    paymentMethod = payment.find((p) => p._id.toString() === paymentId);
  }

  function handlePackagingDepositClick() {
    modalV2.open(
      <Suspense
        fallback={
          <Typography variant="h1" gutterBottom>
            Packaging Deposit?
          </Typography>
        }
      >
        <PackagingDepositInfo />
      </Suspense>,
    );
  }

  return (
    <>
      {/* Address */}
      <Card style={{ marginBottom: '16px' }} elevation={0}>
        <Box px={2} py={1}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography component="h2" variant="h4">
              Shipping Address
            </Typography>

            <PrimaryTextLink to="/checkout/shipping">
              <Typography component="span" variant="h6">
                Change
              </Typography>
            </PrimaryTextLink>
          </Box>
          {address ? (
            <Address
              address={address}
              preferredAddressId={user.preferred_address}
            />
          ) : (
            <Typography>No shipping address selected.</Typography>
          )}
        </Box>
      </Card>

      {/* Shipping method */}
      <Card style={{ marginBottom: '16px' }} elevation={0}>
        <Box px={2} py={1} pb={2}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography component="h2" variant="h4">
              Shipping Method
            </Typography>

            <PrimaryTextLink to="/checkout/shipping">
              <Typography component="span" variant="h6">
                Change
              </Typography>
            </PrimaryTextLink>
          </Box>
          {shippingMethod ? (
            <Typography>{getDeliveryDates(shippingMethod)}</Typography>
          ) : (
            <Typography>No shipping method selected.</Typography>
          )}
        </Box>
      </Card>

      {/* Payment method */}
      <Card style={{ marginBottom: '16px' }} elevation={0}>
        <Box px={2} py={1}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography component="h2" variant="h4">
              Payment Method
            </Typography>

            <PrimaryTextLink to="/checkout/payment">
              <Typography component="span" variant="h6">
                Change
              </Typography>
            </PrimaryTextLink>
          </Box>
          {paymentMethod ? (
            <CreditCard my={0} paymentMethod={paymentMethod} />
          ) : (
            <Box py={1}>
              <Typography>No payment method selected.</Typography>
            </Box>
          )}
          <Box mt={3}>
            <ApplyPromoCodeForm />
          </Box>
        </Box>
      </Card>

      {/* Order Summary */}
      <Card elevation={0}>
        <Box p={2}>
          <Typography component="h2" variant="h4" gutterBottom>
            Order Summary
          </Typography>
          <Typography component="p" variant="h6" gutterBottom>
            Products
          </Typography>
          {cart_items.map((item, i) => (
            <OrderItem key={item.product_name} item={item} />
          ))}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={4}
          >
            <Typography>Subtotal</Typography>
            <Typography>{formatMoney(order.subtotal / 100)}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Typography>Packaging Deposit</Typography>
              <IconButton onClick={handlePackagingDepositClick}>
                <InfoIcon />
              </IconButton>
            </Box>

            <Typography>
              {formatMoney(order.packaging_deposit / 100)}
            </Typography>
          </Box>
          <Box mb={2}>
            <Divider />
          </Box>

          {/* Tax && Fees */}
          <Typography component="h3" variant="h6" gutterBottom>
            Taxes and Fees
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            color={
              !wasTaxed ? theme.palette.success.main : theme.palette.text.main
            }
          >
            <Typography>Tax</Typography>
            <Typography>
              {wasTaxed ? formatMoney(order.tax_amount / 100) : 'None'}
            </Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            color={
              hasFreeShipping
                ? theme.palette.success.main
                : theme.palette.text.main
            }
          >
            <Typography gutterBottom={hasDiscount ? true : false}>
              Shipping
            </Typography>
            <Typography gutterBottom={hasDiscount ? true : false}>
              {hasFreeShipping
                ? 'Free'
                : formatMoney(order.delivery_amount / 100)}
            </Typography>
          </Box>
          {hasDiscount && (
            <>
              <Box mb={2}>
                <Divider />
              </Box>
              <Typography component="p" variant="h6" gutterBottom>
                Discounts and Promotions
              </Typography>
            </>
          )}
          <Box color={theme.palette.success.main}>
            {order.applied_packaging_balance === 0 ? null : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Packaging Deposit Balance</Typography>
                <Typography>
                  -{formatMoney(order.applied_packaging_balance / 100)}
                </Typography>
              </Box>
            )}

            {order.applied_store_credit === 0 ? null : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Store Credit</Typography>
                <Typography>
                  -{formatMoney(order.applied_store_credit / 100)}
                </Typography>
              </Box>
            )}

            {order.promo_discount === 0 ? null : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Promotional Discounts</Typography>

                <Typography>
                  -{formatMoney(order.promo_discount / 100)}
                </Typography>
              </Box>
            )}
            {cart.applied_promo_codes.length ? (
              <>
                <Typography color="textPrimary" component="p">
                  Applied Promo Codes
                </Typography>
                <List>
                  {cart.applied_promo_codes.map((code) => (
                    <ListItem key={code.promo_code} style={{ padding: '8px' }}>
                      <Typography color="textPrimary">
                        {code.promo_code}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="p">
              Total
            </Typography>
            <Typography variant="h6" component="p">
              {formatMoney(orderTotal)}
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
});

function OrderItem({ item }) {
  const { customer_quantity, product_name, total } = item;
  return (
    <>
      <Grid container justify="space-between">
        <Grid item xs={9} md={10}>
          <Typography>{product_name}</Typography>
        </Grid>
        <Grid item>
          <Typography>{formatMoney(total / 100)}</Typography>
        </Grid>
      </Grid>
      <Typography color="textSecondary" gutterBottom>
        Quantity {customer_quantity}
      </Typography>
    </>
  );
}
