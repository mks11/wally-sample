import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid } from '@material-ui/core';

export default function EmptyCartMessage() {
  return (
    <Grid container>
      <Grid item xs={11}>
        <Typography variant="h1" align={'left'}>
          It looks like your cart is empty!
        </Typography>
      </Grid>
      <Grid item xs={11}>
        <Typography variant="body1" align={'left'}>
          Why don’t you{' '}
          <Link to="/main" className={'color-purple'}>
            head back to our shop
          </Link>{' '}
          so we can fix that?
        </Typography>
      </Grid>
    </Grid>
  );
}
