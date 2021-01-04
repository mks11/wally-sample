import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';

function UpdateModal({ toggle }) {
  return (
    <Container maxWidth="md">
      <Typography variant="h1"> Edit Address </Typography>
      <Box padding={2}>{/* <AddressUpdateForm toggle={toggle} /> */}</Box>
    </Container>
  );
}

export default UpdateModal;
