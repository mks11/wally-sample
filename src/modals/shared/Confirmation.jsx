import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Button } from '@material-ui/core';
import { DangerButton } from '../../styled-component-lib/Buttons';

function Confirmation({ title, message, onCancel, onConfirm }) {
  return (
    <>
      <div className="modal-header">
        <Typography variant="h2" color="error">
          {title}
        </Typography>
      </div>
      <Box padding={3} justifyContent="center">
        <Typography align="center">{message}</Typography>
        <Box marginTop={6}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6} lg={4}>
              <Button size="large" fullWidth onClick={onCancel}>
                <Typography>Cancel</Typography>
              </Button>
            </Grid>
            <Grid item xs={6} lg={4}>
              <DangerButton size="large" fullWidth onClick={onConfirm}>
                <Typography>Yes, I’m sure</Typography>
              </DangerButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Confirmation;
