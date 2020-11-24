import React, { useEffect, useState } from 'react';
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
import { LazyLoadImage } from 'react-lazy-load-image-component';
import RemoveItemForm from 'forms/cart/RemoveItem';

// Custom Components
import CarbonBar from 'common/CarbonBar';
import LoginForm from 'forms/authentication/LoginForm';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

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
  const [quantity, setQuantity] = useState(customer_quantity || 0);
  const { checkout, loading, modalV2, user } = useStores();

  var productImage;
  var brand;

  if (product && product[0]) {
    const { image_refs, vendorFull } = product[0];

    if (image_refs && image_refs[0]) {
      productImage = PRODUCT_BASE_URL + product_id + '/' + image_refs[0];
    }

    if (vendorFull && vendorFull.name) brand = vendorFull.name;
  }

  const handleAddQty = () => {
    setQuantity(quantity + 1);
  };

  const handleRemoveQty = () => {
    setQuantity(quantity - 1);
  };

  const handleUpdateCart = async (items) => {
    const auth = user.getHeaderAuth();
    checkout.editCurrentCart({ items }, auth);
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

  useEffect(() => {
    handleUpdateCart([
      {
        quantity,
        product_id,
        inventory_id,
        unit_type,
      },
    ]);
  }, [quantity]);

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
            <LazyLoadImage
              alt={product_name}
              height={60}
              src={productImage}
              width={60}
            />
          ) : null}
        </Grid>
        <Grid item xs={8}>
          <Typography>{product_name}</Typography>
          {brand && (
            <Typography variant="body2" color="textSecondary">
              {brand}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Quantity adjustment and subtotal */}
      <Box my={4}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Box display="flex" alignItems="center">
              <IconButton
                color="primary"
                disableRipple
                onClick={handleRemoveQty}
                disabled={quantity < 2}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton
                color="primary"
                disableRipple
                onClick={handleAddQty}
                disabled={quantity > 9}
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
