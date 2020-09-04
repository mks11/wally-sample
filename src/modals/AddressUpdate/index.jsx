import React from 'react';
import AddressUpdateForm from './AddressUpdateForm';
import { Box, Container, Typography } from '@material-ui/core';

function UpdateModal({ stores, toggle }) {
  return (
    <Container maxWidth="md">
      <Typography variant="h1"> Edit Address </Typography>
      <Box padding={2}>
        <AddressUpdateForm store={stores} toggle={toggle} />
      </Box>
    </Container>
  );
}

export default UpdateModal;
