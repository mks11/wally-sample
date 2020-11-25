import React, { useEffect } from 'react';
// import { PRODUCT_BASE_URL } from 'config';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
  Box,
  Card,
  // CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
// import { AddIcon, CloseIcon, InfoIcon, RemoveIcon } from 'Icons';
import { InfoIcon } from 'Icons';

// Utilities
import { logPageView, logEvent } from 'services/google-analytics';
import { formatMoney } from 'utils';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import { toJS } from 'mobx';

// Custom Components
import DeliveryAddressOptions from './FormikDeliveryAddressOptions';
import PaymentOptions from './PaymentOptions';
import {
  // PrimaryTextButton,
  PrimaryWallyButton,
} from 'styled-component-lib/Buttons';
import ShippingOptions from './ShippingOptions';

// Forms
import { useFormikContext } from 'formik';
// import ApplyPromoCodeForm from 'forms/ApplyPromoCodeForm';
// import RemoveItemForm from 'forms/cart/RemoveItem';

// Modals
import PackagingDepositInfo from 'modals/PackagingDepositInfo';

function Checkout() {
  const {
    checkout: checkoutStore,
    loading: loadingStore,
    modal: modalStore,
    routing: routingStore,
    user: userStore,
  } = useStores();

  useEffect(() => {
    // Store page view in google analytics
    const { location } = routingStore;
    logPageView(location.pathname);

    userStore.getStatus().then(() => {
      const { user } = userStore;
      if (user) {
        const { preferred_address, preferred_payment } = user;

        const selectedAddress =
          userStore.selectedDeliveryAddress ||
          userStore.getAddressById(preferred_address);
        if (selectedAddress) {
          userStore.setDeliveryAddress(selectedAddress);
        }

        const selectedPayment =
          userStore.selectedPaymentMethod ||
          userStore.getPaymentMethodById(preferred_payment);
        if (selectedPayment) {
          userStore.setPaymentMethod(selectedPayment);
        }

        loadData();

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

  return (
    <Formik
      initialValues={{
        addressId: userStore.selectedDeliveryAddress._id || '',
        shippingServiceLevel: 'ups_ground',
        paymentId: userStore.selectedPaymentMethod._id || '',
      }}
      validationSchema={Yup.object({
        addressId: Yup.string().required('You must select a shipping address.'),
        shippingServiceLevel: Yup.string().required(),
        paymentId: Yup.string(),
      })}
      enableReinitialize
      onSubmit={(values, { setFieldError, setSubmitting }) => {
        handlePlaceOrder(values, setFieldError);
        setSubmitting(false);
      }}
    >
      <Form>
        <Container maxWidth="xl">
          <Box mt={3}>
            <Typography variant="h1" gutterBottom>
              Checkout
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {userStore.user && (
              <Grid item xs={12} md={5} lg={6}>
                <DeliveryAddressOptions name="addressId" />
                <ShippingOptions name="shippingServiceLevel" />
                <PaymentOptions
                  name="paymentId"
                  options={toJS(userStore.user.payment)}
                />
              </Grid>
            )}
            <Grid item xs={12} md={7} lg={6} component="section">
              <OrderSummary />
            </Grid>
          </Grid>
        </Container>
      </Form>
    </Formik>
  );

  function handleApplyPromo() {
    const { order } = checkoutStore;

    if (order) {
    }
  }

  function handlePlaceOrder(values, setFieldError) {
    console.log(values);
    return;
    loadingStore.show();
    logEvent({ category: 'Checkout', action: 'ConfirmCheckout' });

    checkoutStore
      .submitOrder(
        {
          cart_id: checkoutStore.cart._id,
          address_id: userStore.selectedDeliveryAddress.address_id,
          payment_id: 'foo',
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
        loadingStore.hide();
      });
  }

  async function loadData() {
    try {
      const auth = userStore.getHeaderAuth();
      await checkoutStore.getOrderSummary(auth);
    } catch (error) {
      console.error(error);
    }
  }
}

export default observer(Checkout);

function OrderSummary() {
  const theme = useTheme();
  const { isSubmitting } = useFormikContext();
  const { checkout, modalV2 } = useStores();

  const { order } = checkout;
  const cart_items = order && order.cart_items ? order.cart_items : [];
  const orderTotal = order.total / 100;

  function handlePackagingDepositClick() {
    modalV2.open(<PackagingDepositInfo />);
  }

  return (
    <Card elevation={4}>
      <Box p={4}>
        <Typography variant="h2" gutterBottom>
          Order Summary
        </Typography>
        {cart_items.map((item, i) => (
          <OrderItem key={item.product_name} item={item} />
        ))}
        <Divider />
        <br />
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography gutterBottom>Subtotal</Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom>
              {formatMoney(order.subtotal / 100)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography gutterBottom>Tax</Typography>
          </Grid>
          <Grid item>
            <Typography gutterBottom>
              {formatMoney(order.tax_amount / 100)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography>Shipping</Typography>
          </Grid>
          <Grid item>
            <Typography>{formatMoney(order.delivery_amount / 100)}</Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Box display="flex" alignItems="center">
              <Typography>Packaging Deposit</Typography>
              <IconButton
                disableRipple
                onClick={handlePackagingDepositClick}
                style={{ margin: '0 16px' }}
              >
                <InfoIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <Typography>
              {formatMoney(order.packaging_deposit / 100)}
            </Typography>
          </Grid>
        </Grid>

        {order.applied_packaging_balance === 0 ? null : (
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography gutterBottom>
                Applied packaging deposit balance
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom>
                -{formatMoney(order.applied_packaging_balance / 100)}
              </Typography>
            </Grid>
          </Grid>
        )}
        {order.promo_discount === 0 ? null : (
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography
                gutterBottom
                style={{ color: theme.palette.success.main }}
              >
                Applied discount
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                gutterBottom
                style={{ color: theme.palette.success.main }}
              >
                -{formatMoney(order.promo_discount / 100)}
              </Typography>
            </Grid>
          </Grid>
        )}

        {order.applied_store_credit === 0 ? null : (
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography gutterBottom>Applied store credit</Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom>
                -{formatMoney(order.applied_store_credit / 100)}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* <div className="item-extras">
          <ApplyPromoCodeForm onApply={() => handleApplyPromo()} />
        </div> */}

        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography variant="h6" component="p" gutterBottom>
              Total
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="p" gutterBottom>
              {formatMoney(orderTotal)}
            </Typography>
          </Grid>
        </Grid>

        <Box my={4}>
          <PrimaryWallyButton
            type="submit"
            fullWidth
            disabled={cart_items.length == 0 || isSubmitting}
          >
            Place My Order
          </PrimaryWallyButton>
          <Box my={2}>
            <Typography variant="body2" color="textSecondary">
              By placing your order, you agree to be bound by the Terms of
              Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

function OrderItem({ item }) {
  const { customer_quantity, product_name, total } = item;
  return (
    <>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Typography variant="h6" component="p">
            {product_name}
          </Typography>
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

// function OrderItem({ item }) {
//   const {
//     customer_quantity,
//     _id,
//     inventory_id,
//     product,
//     product_id,
//     product_name,
//     unit_type,
//   } = item;
//   const [isLoading, setIsLoading] = useState(false);
//   const [increasedQty, setIncreasedQty] = useState(false);
//   const { checkout, modal, modalV2, product: productStore, user } = useStores();
//   var productImage;
//   var brand;

//   if (product) {
//     const { image_refs, vendorFull } = product;
//     if (image_refs && image_refs[0]) {
//       productImage = PRODUCT_BASE_URL + product_id + '/' + image_refs[0];
//     }

//     if (vendorFull && vendorFull.name) brand = vendorFull.name;
//   }

//   const handleDelete = (item) => {
//     logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
//     modalV2.open(<RemoveItemForm item={item} reloadOrderSummary />);
//   };

//   const handleUpdateCart = async (items) => {
//     const auth = user.getHeaderAuth();
//     await checkout.editCurrentCart({ items }, auth, true);
//   };

//   const handleUpdateQuantity = async (qty) => {
//     try {
//       if (qty > 0) setIncreasedQty(true);
//       else setIncreasedQty(false);
//       setIsLoading(true);
//       const updateQty = customer_quantity + qty;
//       handleUpdateCart([
//         {
//           quantity: updateQty,
//           product_id,
//           inventory_id,
//           unit_type,
//         },
//       ]);
//     } catch (error) {}
//   };

//   const handleViewProduct = (productId) => {
//     modalV2.close();
//     productStore.showModal(productId, null);
//     modal.toggleModal('product');
//   };

//   return (
//     <Box>
//       <Grid container alignItems="center" justify="flex-end">
//         <Grid item>
//           <IconButton
//             aria-label="remove-item-from-cart"
//             onClick={() =>
//               handleDelete({
//                 inventoryId: _id,
//                 name: product_name,
//                 productId: product_id,
//               })
//             }
//           >
//             <CloseIcon />
//           </IconButton>
//         </Grid>
//       </Grid>

//       {/* Product image, name, and brand */}
//       <Grid container spacing={2}>
//         <Grid item>
//           {productImage ? (
//             <Box display="flex" alignItems="center" height="100%">
//               <img
//                 alt={product_name}
//                 src={productImage}
//                 style={{ height: '60px', width: '60px' }}
//               />
//             </Box>
//           ) : (
//             <Box height="60px" width="60px" p={2} />
//           )}
//         </Grid>
//         <Grid item xs={8}>
//           <Typography>{product_name}</Typography>
//           {brand && (
//             <Typography variant="body2" color="textSecondary">
//               {brand}
//             </Typography>
//           )}
//           <PrimaryTextButton
//             onClick={() => handleViewProduct(product_id)}
//             style={{
//               fontSize: '14px',
//               fontWeight: 'normal',
//               paddingLeft: '0',
//               paddingTop: '2px',
//             }}
//           >
//             View Product
//           </PrimaryTextButton>
//         </Grid>
//       </Grid>

//       {/* Quantity adjustment and subtotal */}
//       <Box my={1}>
//         <Grid container alignItems="center" justify="space-between">
//           <Grid item>
//             <Box display="flex" alignItems="center">
//               <IconButton
//                 color="primary"
//                 disableRipple
//                 onClick={() => handleUpdateQuantity(-1)}
//                 disabled={customer_quantity < 2 || isLoading}
//               >
//                 {isLoading && !increasedQty ? (
//                   <CircularProgress size={24} />
//                 ) : (
//                   <RemoveIcon />
//                 )}
//               </IconButton>
//               <Typography>{customer_quantity}</Typography>
//               <IconButton
//                 color="primary"
//                 disableRipple
//                 onClick={() => handleUpdateQuantity(1)}
//                 disabled={customer_quantity > 9 || isLoading}
//               >
//                 {isLoading && increasedQty ? (
//                   <CircularProgress size={24} />
//                 ) : (
//                   <AddIcon />
//                 )}
//               </IconButton>
//             </Box>
//           </Grid>
//           <Typography style={{ fontWeight: 'bold' }} align="center">
//             {formatMoney(item.total / 100)}
//           </Typography>
//         </Grid>
//       </Box>
//       <Box mb={1}>
//         <Divider />
//       </Box>
//     </Box>
//   );
// }
