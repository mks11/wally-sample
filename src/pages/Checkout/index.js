import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Box, Container, Grid, Typography } from '@material-ui/core';

// Utilities
import { logPageView, logEvent } from 'services/google-analytics';
import { formatMoney } from 'utils';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Custom Components
import DeliveryAddressOptions from './FormikDeliveryAddressOptions';
import ShippingOptions from './ShippingOptions';
import PaymentOptions from './PaymentOptions';
import PaymentSelect from 'common/PaymentSelect';

import PackagingSummary from './PackagingSummary';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// Forms
import ApplyPromoCodeForm from 'forms/ApplyPromoCodeForm';
import RemoveItemForm from 'forms/cart/RemoveItem';

function Checkout() {
  const {
    checkout: checkoutStore,
    loading: loadingStore,
    modal: modalStore,
    modalV2: modalV2Store,
    product: productStore,
    routing: routingStore,
    user: userStore,
  } = useStores();

  // Addresses
  const [selectedAddress, setSelectedAddress] = useState(undefined);

  // Payment
  const [lockPayment, setLockPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(undefined);

  // Response handling
  const [invalidText, setInvalidText] = useState('');

  useEffect(() => {
    // Store page view in google analytics
    const { location } = routingStore;
    logPageView(location.pathname);

    userStore.getStatus().then((status) => {
      if (status) {
        const selectedAddress =
          userStore.selectedDeliveryAddress ||
          (userStore.user
            ? userStore.getAddressById(userStore.user.preferred_address)
            : null);
        if (selectedAddress) {
          userStore.setDeliveryAddress(selectedAddress);
        }

        loadData();
        if (userStore.user.addresses.length > 0) {
          const selectedAddress = userStore.user.addresses.find(
            (d) => d._id === userStore.user.preferred_address,
          );
          setSelectedAddress(selectedAddress._id);
        }

        if (userStore.user.payment.length > 0) {
          const selectedPayment = userStore.user.payment.find(
            (d) => d._id === userStore.user.preferred_payment,
          );
          setSelectedPayment(selectedPayment._id);
        }

        const { checkoutFirst } = userStore.flags || {};
        !checkoutFirst && modalStore.toggleModal('checkoutfirst');
      } else {
        routingStore.push('/main');
      }
    });
  }, []);

  if (!checkoutStore.order || !userStore.user) {
    return null;
  }

  const { order } = checkoutStore;
  const cart_items = order && order.cart_items ? order.cart_items : [];
  const orderTotal = updateTotal();

  return (
    <Formik
      initialValues={{
        addressId: selectedAddress || '',
        shippingServiceLevel: 'ups_ground',
        paymentId: selectedPayment || '',
      }}
      validationSchema={Yup.object({
        addressId: Yup.string().required('You must select a shipping address.'),
        shippingServiceLevel: Yup.string().required(),
        paymentId: Yup.string(),
      })}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Container maxWidth="xl">
            <Box mt={3}>
              <Typography variant="h1" gutterBottom>
                Checkout
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5} lg={6}>
                {userStore.user && <DeliveryAddressOptions name="addressId" />}

                {userStore.user && (
                  <ShippingOptions
                    lock={false}
                    selected={userStore.selectedDeliveryTime}
                    title="Shipping Option"
                    user={userStore.user}
                  />
                )}

                {userStore.user && <PaymentOptions />}
              </Grid>
              <Grid item xs={12} md={7} lg={6} component="section">
                <div className="card1 card-shadow">
                  <div className="card-body">
                    <h3 className="m-0 mb-2">Order Summary</h3>
                    <hr />
                    {cart_items.map((c, i) => {
                      const unit_type = c.unit_type || c.price_unit;
                      const showType =
                        unit_type === 'packaging'
                          ? c.packaging_name
                          : unit_type;

                      return (
                        <div className="item mt-3 pb-2" key={i}>
                          <div className="item-left">
                            <h4 className="item-name">
                              {c.product_id !== 'prod_pckging' ? (
                                c.product_name
                              ) : (
                                <PackagingSummary title={c.product_name} />
                              )}
                            </h4>
                            {unit_type !== 'packaging' &&
                              c.product_id !== 'prod_pckging' && (
                                <span className="item-detail mt-2 mb-1">
                                  {c.packaging_name}
                                </span>
                              )}
                            {c.product_id !== 'prod_pckging' && (
                              <div className="item-link">
                                <a
                                  onClick={(e) =>
                                    handleEdit(
                                      c.product_id,
                                      c.customer_quantity,
                                    )
                                  }
                                  className="text-blue mr-2"
                                >
                                  EDIT
                                </a>
                                <a
                                  onClick={(e) => handleDelete(c)}
                                  className="text-dark-grey"
                                >
                                  DELETE
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="item-right">
                            <h4>
                              x{c.customer_quantity} {showType}
                            </h4>
                            <span className="item-price">
                              {formatMoney(c.total / 100)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="item-summaries">
                      <div className="summary">
                        <span>Subtotal</span>
                        <span>{formatMoney(order.subtotal / 100)}</span>
                      </div>
                      <div className="summary">
                        <span>Taxes</span>
                        <span>{formatMoney(order.tax_amount / 100)}</span>
                      </div>
                      <div className="summary">
                        <span>Delivery fee (For there & back again)</span>
                        <span>{formatMoney(order.delivery_amount / 100)}</span>
                      </div>

                      <div className="summary">
                        <span>
                          <strong>
                            <a onClick={handlePackagingDepositClick}>
                              {' '}
                              Packaging Deposit{' '}
                            </a>
                          </strong>{' '}
                          (You'll get this back ;) )
                        </span>
                        <span>
                          {formatMoney(order.packaging_deposit / 100)}
                        </span>
                      </div>

                      {order.applied_packaging_balance === 0 ? null : (
                        <div className="summary">
                          <span>Applied packaging deposit balance</span>
                          <span>
                            -
                            {formatMoney(order.applied_packaging_balance / 100)}
                          </span>
                        </div>
                      )}

                      {order.promo_discount === 0 ? null : (
                        <div className="summary">
                          <span>Applied discount</span>
                          <span>
                            -{formatMoney(order.promo_discount / 100)}
                          </span>
                        </div>
                      )}

                      {order.applied_store_credit === 0 ? null : (
                        <div className="summary">
                          <span>Applied store credit</span>
                          <span>
                            -{formatMoney(order.applied_store_credit / 100)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="item-extras">
                      <ApplyPromoCodeForm onApply={() => handleApplyPromo()} />
                    </div>

                    <div className="item-total">
                      <span>Total</span>
                      <span>{formatMoney(orderTotal)}</span>
                    </div>

                    <PrimaryWallyButton
                      type="submit"
                      fullWidth
                      disabled={cart_items.length == 0 || isSubmitting}
                      style={{ padding: '0.5rem 0' }}
                    >
                      Place My Order
                    </PrimaryWallyButton>
                    {invalidText ? (
                      <span className="text-error text-center d-block mt-2">
                        {invalidText}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3">
                  By placing your order, you agree to be bound by the Terms of
                  Service and Privacy Policy.
                </p>
              </Grid>
            </Grid>
          </Container>
        </Form>
      )}
    </Formik>
  );

  function handleAddPayment(data) {
    if (data) {
      userStore.setUserData(data);
      setSelectedPayment(userStore.user.preferred_payment);
    }
  }

  function handleApplyPromo() {
    const { order } = checkoutStore;

    if (order) {
    }
  }

  function handleDelete({ product_name, product_id, inventory_id }) {
    modalV2Store.open(
      <RemoveItemForm
        item={{
          name: product_name,
          productId: product_id,
          inventoryId: inventory_id,
        }}
      />,
    );

    loadData();
  }

  function handleEdit(id, quantity) {
    productStore
      .showModal(id, quantity, userStore.getDeliveryParams())
      .then(() => {
        modalStore.toggleModal('product');
      });
  }

  function handlePackagingDepositClick() {
    modalStore.toggleModal('packagingdeposit');
  }

  function handlePlaceOrder() {
    setInvalidText('');

    if (!lockPayment) {
      setInvalidText('Please select payment');
      return;
    }
    loadingStore.show();
    logEvent({ category: 'Checkout', action: 'ConfirmCheckout' });

    checkoutStore
      .submitOrder(
        {
          cart_id: checkoutStore.cart._id,
          address_id: userStore.selectedDeliveryAddress.address_id,
          payment_id: selectedPayment,
        },
        userStore.getHeaderAuth(),
      )
      .then((data) => {
        logEvent({
          category: 'Order',
          action: 'Submit Order',
        });
        routingStore.push('/orders/' + data.order._id);
        checkoutStore.clearCart(userStore.getHeaderAuth());
        userStore.setDeliveryTime(null);
        loadingStore.hide();
      })
      .catch((e) => {
        console.error('Failed to submit order', e);
        const msg = e.response.data.error.message;
        setInvalidText(msg);
        loadingStore.hide();
      });
  }

  function handleSubmitPayment(lock, selectedPayment) {
    logEvent({ category: 'Checkout', action: 'SubmitPayment' });
    setLockPayment(lock);
    setSelectedPayment(selectedPayment);
  }

  function loadData() {
    checkoutStore
      .getOrderSummary(userStore.getHeaderAuth())
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function updateTotal() {
    const { order } = checkoutStore;

    return order.total / 100;
  }
}

export default observer(Checkout);
