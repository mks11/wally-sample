import React from 'react';

// Mobx
import { useStores } from 'hooks/mobx';

// Services and Utilities
import { logEvent } from 'services/google-analytics';

import { Box, Grid, Typography } from '@material-ui/core';
import { PrimaryWallyButton, DangerButton } from 'styled-component-lib/Buttons';

function RemoveItemForm({
  item,
  handleReinitializeCartSummary,
  reloadOrderSummary = false,
}) {
  const { checkout, user, modalV2 } = useStores();

  const handleClose = () => {
    handleReinitializeCartSummary
      ? handleReinitializeCartSummary()
      : modalV2.close();
  };

  const handleDelete = () => {
    logEvent({ category: 'Cart', action: 'ConfirmDelete' });

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
        reloadOrderSummary,
        user.getDeliveryParams(),
      )
      .then(() => handleClose())
      .catch((e) => {
        // TODO: ERROR HANDLING
        // if (
        //   e.response &&
        //   e.response.data &&
        //   e.response.data.error &&
        //   e.response.data.error.message
        // ) {
        //   const msg = e.response.data.error.message;
        // }
        console.error('Failed to add to cart', e);
      });
  };
  return (
    <Box>
      <Typography variant="h1">Remove from Cart</Typography>
      <Box py={2}>
        <Typography
          gutterBottom
        >{`Are you sure you want to remove ${item.name} from your cart?`}</Typography>
      </Box>
      <Box py={1}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={6}>
            <DangerButton onClick={handleDelete} fullWidth>
              <Typography>Yes</Typography>
            </DangerButton>
          </Grid>
          <Grid item xs={6}>
            <PrimaryWallyButton onClick={handleClose} fullWidth>
              <Typography>No</Typography>
            </PrimaryWallyButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RemoveItemForm;
