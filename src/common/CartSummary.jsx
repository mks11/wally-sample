import React from 'react';
import { PRODUCT_BASE_URL } from 'config';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent } from 'services/google-analytics';
import { formatMoney, getItemsCount } from 'utils';

// npm Package Components
import { Box, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import { AddIcon, CloseIcon, RemoveIcon } from 'Icons';

// Custom Components
import RemoveItemForm from 'forms/cart/RemoveItem';

// Custom Components
import CarbonBar from 'common/CarbonBar';
import LoginForm from 'forms/authentication/LoginForm';

// Styled Components
import {
  PrimaryTextButton,
  PrimaryWallyButton,
} from 'styled-component-lib/Buttons';

const CartSummary = observer(() => {
  const { checkout, routing, user, modalV2 } = useStores();
  const { cart } = checkout;
  const items = cart ? cart.cart_items : [];
  const count = getItemsCount(items);
  const subtotal = cart ? cart.subtotal / 100 : 0;

  const handleCheckout = () => {
    logEvent({ category: 'Cart', action: 'ClickCheckout' });
    if (user.status) {
      modalV2.close();
      routing.push('/similar-products');
    } else {
      modalV2.open(<LoginForm />);
    }
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Cart
      </Typography>
      {items && count > 0 ? (
        <>
          <Box mb={2}>
            <CarbonBar nCartItems={count} />
          </Box>
          <Divider />
          <Box my={2}>
            {items.map((item) => (
              <Box key={item.product_name}>
                {/* Cart Item Quantity Management*/}
                <CartItem item={item} />
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <Typography>No items in cart</Typography>
      )}
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
      <Box display="flex" justifyContent="center" py={2}>
        <PrimaryWallyButton disabled={count < 1} onClick={handleCheckout}>
          Proceed to Checkout
        </PrimaryWallyButton>
      </Box>
    </>
  );
});

export default CartSummary;

function CartItem({ item }) {
  const {
    customer_quantity,
    _id,
    inventory_id,
    product,
    product_id,
    product_name,
    unit_type,
  } = item;

  const { checkout, modal, modalV2, product: productStore, user } = useStores();
  var productImage;
  var brand;

  if (product && product[0]) {
    const { image_refs, vendorFull } = product[0];

    if (image_refs && image_refs[0]) {
      productImage = PRODUCT_BASE_URL + product_id + '/' + image_refs[0];
    }

    if (vendorFull && vendorFull.name) brand = vendorFull.name;
  }

  const handleUpdateCart = async (items) => {
    const auth = user.getHeaderAuth();
    checkout.editCurrentCart({ items }, auth);
  };

  const handleUpdateQuantity = async (qty) => {
    try {
      const updateQty = customer_quantity + qty;
      handleUpdateCart([
        {
          quantity: updateQty,
          product_id,
          inventory_id,
          unit_type,
        },
      ]);
    } catch (error) {}
  };

  const handleViewProduct = (productId) => {
    modalV2.close();
    productStore.showModal(productId, null);
    modal.toggleModal('product');
  };

  const handleDelete = (item) => {
    logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
    modalV2.open(
      <RemoveItemForm
        item={item}
        handleReinitializeCartSummary={openCartSummary}
      />,
    );
  };

  function openCartSummary() {
    modalV2.open(<CartSummary />, 'right');
  }

  return (
    <Box>
      <Grid container alignItems="center" justify="flex-end">
        <Grid item>
          <IconButton
            aria-label="remove-item-from-cart"
            onClick={() =>
              handleDelete({
                inventoryId: _id,
                name: product_name,
                productId: product_id,
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
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Box display="flex" alignItems="center">
              <IconButton
                color="primary"
                disableRipple
                onClick={() => handleUpdateQuantity(-1)}
                disabled={customer_quantity < 2}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{customer_quantity}</Typography>
              <IconButton
                color="primary"
                disableRipple
                onClick={() => handleUpdateQuantity(1)}
                disabled={customer_quantity > 9}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>
          <Typography style={{ fontWeight: 'bold' }} align="center">
            {formatMoney(item.total / 100)}
          </Typography>
        </Grid>
      </Box>
      <Box mb={4}>
        <Divider />
      </Box>
    </Box>
  );
}
