import React from 'react';

// Mobx
import { useStores } from 'hooks/mobx';

// Services and Utilities
import { logEvent } from 'services/google-analytics';

import { Box, Grid, Typography } from '@material-ui/core';
import { PrimaryWallyButton, DangerButton } from 'styled-component-lib/Buttons';

function RemoveItemForm({ item }) {
  const { routing, checkout, user, modalV2 } = useStores();

  const handleClose = () => modalV2.close();
  const handleDelete = () => {
    logEvent({ category: 'Cart', action: 'ConfirmDelete' });

    const orderSummary = routing.location.pathname.indexOf('cart') !== -1;

    // TODO: ERROR HANDLING
    checkout
      .editCurrentCart(
        {
          items: [
            {
              quantity: 0,
              product_id: item.productId,
              inventory_id: item.inventoryId,
            },
          ],
        },
        user.getHeaderAuth(),
        orderSummary,
        user.getDeliveryParams(),
      )
      .then(() => modalV2.close())
      .catch((e) => {
        const msg = e.response.data.error.message;
        console.error('Failed to add to cart', e);
      });
  };
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Remove from Cart
      </Typography>
      <Typography
        gutterBottom
      >{`Are you sure you want to remove ${item.name} from your cart?`}</Typography>
      <Box py={1}>
        <Grid container spacing={2}>
          <Grid item>
            <PrimaryWallyButton onClick={handleDelete}>
              <Typography>Yes</Typography>
            </PrimaryWallyButton>
          </Grid>
          <Grid item>
            <DangerButton onClick={handleClose}>
              <Typography>No</Typography>
            </DangerButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RemoveItemForm;
