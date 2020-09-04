import React from 'react';
import AddressUpdateForm from './AddressUpdateForm';
import { Box, Typography } from '@material-ui/core';

function UpdateModal({ stores, toggle }) {
  return (
    <>
      <div className="modal-header">
        <Typography variant="h2"> Edit Address </Typography>
      </div>
      <Box padding={2}>
        <AddressUpdateForm store={stores} toggle={toggle} />
      </Box>
    </>
  );
}

export default UpdateModal;
