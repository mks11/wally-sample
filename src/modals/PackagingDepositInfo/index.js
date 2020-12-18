import React from 'react';
import { Box, List, ListItem, Typography } from '@material-ui/core';

function PackagingDepositInfo() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Packaging Deposit?
      </Typography>
      <Typography gutterBottom>
        We charge a deposit for each piece of packaging used in your order. When
        you return your packaging to us, your account will be credited for each
        piece of packaging we receive.
      </Typography>
      <Typography gutterBottom>
        Your packaging balance will be used to cover the packaging deposit of
        future purchases. If the amount of the deposit on your future order
        costs more than your current balance, you'll only pay the difference.
      </Typography>
      <Typography gutterBottom>
        If you prefer, you can{' '}
        <a
          href="mailto: info@thewallyshop.co"
          alt="contact the wally shop to refund your packaging balance to card."
        >
          contact us
        </a>{' '}
        to have your packaging deposit refunded to your preferred payment
        method.
      </Typography>
      <br />
      <Typography variant="h2" gutterBottom>
        Packaging Deposit Costs
      </Typography>
      <Typography gutterBottom>
        Below you'll find the deposits we charge for each of the types of
        packaging we use.
      </Typography>
      <List>
        <ListItem>
          <Typography>
            <strong>Shipping Tote</strong> - $10 each (one size)
          </Typography>
        </ListItem>
        <ListItem>
          <Typography gutterBottom>
            <strong>Reusable Jar</strong> - $1 each (all sizes)
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
}

export default PackagingDepositInfo;
