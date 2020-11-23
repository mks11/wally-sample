import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

export default function HowTo({
  title,
  description,
  photoAlign,
  children,
  photo,
  ...rest
}) {
  return (
    <Box my={12} display="flex">
      <Grid
        container
        spacing={4}
        justify="center"
        direction={photoAlign === 'left' ? 'row-reverse' : 'row'}
      >
        <Grid
          item
          xs={12}
          sm={6}
          justify="center"
          alignItems="center"
          style={{
            display: 'flex',
          }}
        >
          <Box>
            <Typography variant="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box textAlign="center">{photo}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}
