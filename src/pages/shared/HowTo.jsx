import React from 'react';
import { Box, Container, Grid, Typography } from '@material-ui/core';

export default function HowTo({
  children,
  description,
  justify,
  photoAlign,
  photo,
  title,
  ...rest
}) {
  return (
    <Grid
      container
      justify={justify || 'center'}
      alignItems="center"
      direction={photoAlign === 'left' ? 'row-reverse' : 'row'}
    >
      <Grid item xs={12} sm={6}>
        <Box my={5}>
          <Container maxWidth="sm">
            <Typography variant="h2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </Container>
        </Box>
      </Grid>
      {photo && (
        <Grid item xs={12} sm={6}>
          <Container maxWidth="sm">
            <Box textAlign="center">{photo}</Box>
          </Container>
        </Grid>
      )}
    </Grid>
  );
}
