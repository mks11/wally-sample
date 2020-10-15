import React from 'react';

// Material UI
import { Box, Typography } from '@material-ui/core';

export default function RedeemPackagingBalance() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Redeem Packaging Balance
      </Typography>
      <Typography>
        If you'd like us to refund your current packaging balance to your
        primary payment method, please email us at{' '}
        <a href="mailto:info@thewallyshop.co">info@thewallyshop.co</a> with the
        subject line "Redeem Packaging Balance".
      </Typography>
    </Box>
  );
}
