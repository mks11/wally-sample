import React from 'react';
import { Box, Typography, Grid, Button } from '@material-ui/core';
import { DangerButton } from 'styled-component-lib/Buttons';

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
        userStore.getUser();
        snackbar.openSnackbar(
          'Your address was deleted successfully.',
          'success',
        );
      })
      .catch(() => {
        snackbar.openSnackbar(
          'An error occured while deleting your address. Please contact us at info@thewallyshop.co for assistance.',
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
        <Box marginTop={3}>
          <Grid container justify="flex-end">
            <Grid item xs={6} lg={4} container justify="center">
              <Button size="large" fullWidth onClick={handleCancel}>
                <Typography variant="body1">Cancel</Typography>
              </Button>
            </Grid>
            <Grid item xs={6} lg={4} container justify="center">
              <DangerButton
                size="large"
                fullWidth
                onClick={() => handleDelete(address_id)}
              >
                <Typography variant="body1">Yes, I’m sure</Typography>
              </DangerButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default AddressDeleteModal;
