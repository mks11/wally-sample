import React from 'react';

import { Box, Card, Grid, Typography } from '@material-ui/core';
import { PrimaryTextButton } from 'styled-component-lib/Buttons';

export default function CheckoutCard({ children, handleOpen, title }) {
  return (
    <Box mb={4}>
      <Card>
        <Box p={4}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h2">{title}</Typography>
            </Grid>
            <Grid item>
              <PrimaryTextButton disableRipple onClick={handleOpen}>
                Edit
              </PrimaryTextButton>
            </Grid>
          </Grid>
          <Box>{children}</Box>\
        </Box>
      </Card>
    </Box>
  );
}
