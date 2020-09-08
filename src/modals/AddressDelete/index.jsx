import React from 'react';
import { Box, Typography, Grid, Button } from '@material-ui/core';
import { DangerButton } from 'styled-component-lib/Buttons';
import axios from 'axios';
import { API_ADDRESS_REMOVE } from 'config';

function AddressDeleteModal({
  stores: { user: userStore, modal: modalStore, loading, snackbar },
  toggle,
}) {
  const handleCancel = () => {
    toggle && toggle();
  };
  const handleDelete = (address_id) => {
    loading.toggle();
    userStore
      .deleteAddress(address_id)
      .then(() => {
        snackbar.openSnackbar('The address was deleted!', 'success');
      })
      .catch((err) => {
        snackbar.openSnackbar(
          'There was an error in deleting the address. Please contact info@thewallyshop.co for assistance.',
          'error',
        );
      })
      .finally(() => {
        toggle && toggle(); // close the modal
        setTimeout(loading.toggle(), 300);
      });
  };

  const address_id = modalStore.modalData;

  return (
    <>
      <div className="modal-header">
        <Typography variant="h2" color="error">
          Delete Address
        </Typography>
      </div>
      <Box padding={3} justifyContent="center">
        <Typography align="center">
          Are you sure you want to remove this address?
        </Typography>
      </Box>
      <Grid container justify="center">
        <Grid item xs={6} container justify="center">
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6} container justify="center">
          <DangerButton size="large" onClick={() => handleDelete(address_id)}>
            Yes, I’m sure
          </DangerButton>
        </Grid>
      </Grid>
    </>
  );
}

export default AddressDeleteModal;
