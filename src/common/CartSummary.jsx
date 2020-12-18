import React, { lazy, Suspense, useState } from 'react';
import { PRODUCT_BASE_URL } from 'config';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent } from 'services/google-analytics';
import { formatMoney } from 'utils';

// npm Package Components
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { AddIcon, ArrowBackIcon, CloseIcon, RemoveIcon } from 'Icons';

// Custom Components
import CarbonBar from 'common/CarbonBar';

// Styled Components
import { PrimaryTextButton } from 'styled-component-lib/Buttons';

const CartSummary = observer(() => {
  const { checkout } = useStores();
  const { cart } = checkout;
  const items = cart ? cart.cart_items : [];
  const subtotal = cart ? cart.subtotal / 100 : 0;
  console.log(items);
  return (
    <>
      <Box mb={2}>
        <CarbonBar />
      </Box>
      {items.length ? (
        <>
          <Box my={2}>
            {items.map((item) => (
              <Box key={item.product_name}>
                {/* Cart Item Quantity Management*/}
                <CartItem item={item} />
              </Box>
            ))}
          </Box>
          <Box my={2}>
            <Grid container justify="space-between" alignItems="center">
              <Typography variant="h6" component="span">
                Subtotal
              </Typography>
              <Typography variant="h6" component="span">
                {formatMoney(subtotal)}
              </Typography>
            </Grid>
          </Box>
        </>
      ) : (
        <Typography>No items in cart</Typography>
      )}
    </>
  );
});

export default CartSummary;

const ProductModal = lazy(() => import('modals/ProductModalV2'));
const RemoveItemForm = lazy(() => import('forms/cart/RemoveItem'));

function CartItem({ item }) {
  const {
    customer_quantity,
    inventory_id,
    product,
    product_id,
    product_name,
  } = item;
  const [isLoading, setIsLoading] = useState(false);
  const [increasedQty, setIncreasedQty] = useState(false);
  const {
    checkout,
    modalV2,
    product: productStore,
    routing,
    user,
  } = useStores();
  var brand;
  var productImage;

  // If we're on the checkout page, we should reload the order summary.
  const shouldReloadOrderSummary = routing.location.pathname.includes(
    'checkout',
  );

  if (product && product[0]) {
    const { image_refs, vendorFull } = product[0];

    if (image_refs && image_refs[0]) {
      productImage = PRODUCT_BASE_URL + product_id + '/' + image_refs[0];
    }

    if (vendorFull && vendorFull.name) brand = vendorFull.name;
  }

  const handleDelete = (item) => {
    logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
    modalV2.open(
      <Suspense fallback={<Typography variant="h1">Remove Item</Typography>}>
        <RemoveItemForm
          item={item}
          handleReinitializeCartSummary={openCartSummary}
          reloadOrderSummary={shouldReloadOrderSummary}
        />
      </Suspense>,
    );
  };

  const handleUpdateCart = (items) => {
    const auth = user.getHeaderAuth();
    return checkout.editCurrentCart({ items }, auth, shouldReloadOrderSummary);
  };

  const handleUpdateQuantity = async (qty) => {
    try {
      if (qty > 0) setIncreasedQty(true);
      else setIncreasedQty(false);
      setIsLoading(true);
      const updateQty = customer_quantity + qty;
      await handleUpdateCart([
        {
          inventory_id,
          quantity: updateQty,
        },
      ]);
    } catch (error) {
      // TODO HANDLE ERRORS
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (productId) => {
    productStore.showModal(productId, null);
    modalV2.close();
    modalV2.open(
      <Suspense fallback={<p>Loading...</p>}>
        <Box p={1} paddingLeft={0}>
          <PrimaryTextButton
            onClick={openCartSummary}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </PrimaryTextButton>
        </Box>
        <ProductModal />
      </Suspense>,
      'right',
      'md',
    );
  };

  function openCartSummary() {
    modalV2.open(
      <>
        <Typography variant="h1" gutterBottom>
          Cart
        </Typography>
        <CartSummary />
      </>,
      'right',
    );
  }

  return (
    <Box>
      <Grid container alignItems="center" justify="flex-end">
        <Grid item>
          <IconButton
            aria-label="remove-item-from-cart"
            onClick={() =>
              handleDelete({
                inventoryId: inventory_id,
                name: product_name,
              })
            }
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Product image, name, and brand */}
      <Grid container spacing={2}>
        <Grid item>
          {productImage ? (
            <Box display="flex" alignItems="center" height="100%">
              <img
                alt={product_name}
                src={productImage}
                style={{ height: '60px', width: '60px' }}
              />
            </Box>
          ) : (
            <Box height="60px" width="60px" p={2} />
          )}
        </Grid>
        <Grid item xs={8}>
          <Typography>{product_name}</Typography>
          {brand && (
            <Typography variant="body2" color="textSecondary">
              {brand}
            </Typography>
          )}
          <PrimaryTextButton
            onClick={() => handleViewProduct(product_id)}
            style={{
              fontSize: '14px',
              fontWeight: 'normal',
              paddingLeft: '0',
              paddingTop: '2px',
            }}
          >
            View Product
          </PrimaryTextButton>
        </Grid>
      </Grid>

      {/* Quantity adjustment and subtotal */}
      <Box my={1}>
        <Box alignItems="center" display="flex" justifyContent="flex-end">
          <Box
            display="flex"
            alignItems="center"
            style={{ marginRight: '16px' }}
          >
            <IconButton
              color="primary"
              onClick={() => handleUpdateQuantity(-1)}
              disabled={customer_quantity < 2 || isLoading}
            >
              {isLoading && !increasedQty ? (
                <CircularProgress size={24} />
              ) : (
                <RemoveIcon />
              )}
            </IconButton>
            <Typography style={{ margin: '0 4px' }}>
              {customer_quantity}
            </Typography>
            <IconButton
              color="primary"
              onClick={() => handleUpdateQuantity(1)}
              disabled={customer_quantity > 9 || isLoading}
            >
              {isLoading && increasedQty ? (
                <CircularProgress size={24} />
              ) : (
                <AddIcon />
              )}
            </IconButton>
          </Box>
          {item && item.product_price && (
            <Typography align="center">
              {formatMoney(item.product_price / 100)} ea
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Typography component="p" variant="h6" align="center">
            {formatMoney(item.total / 100)}
          </Typography>
        </Box>
      </Box>
      <Box mb={1}>
        <Divider />
      </Box>
    </Box>
  );
}
