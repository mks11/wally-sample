import React, { lazy, Suspense, useState } from 'react';

// Custom Components
import PaymentSelect from 'common/PaymentSelect';
import { CreditCard } from 'common/PaymentMethods';

// Formik
import { useField, useFormikContext } from 'formik';

// Material UI
import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { AddIcon, CloseIcon, KeyboardArrowDownIcon } from 'Icons';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Styled Components
import { HelperText } from 'styled-component-lib/HelperText';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

function PaymentMethods({ name }) {
  // Formik Context
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const { values, setFieldValue } = useFormikContext() || {};

  // Local State
  const [isOpen, setIsOpen] = useState(false);

  // MobX Stores
  const { user: userStore } = useStores();
  const { user = {} } = userStore;

  // Will be equal to a stringified object id
  const paymentMethodId = values[name];
  const collapsedHeight = paymentMethodId ? 80 : 50;
  const selectedPaymentMethod = user
    ? user.payment.find((p) => p._id === paymentMethodId)
    : '';

  // Material UI theme
  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSelect = (paymentMethodId) => {
    setFieldValue && setFieldValue(name, paymentMethodId);
  };

  return (
    <Box
      border={`1px solid ${
        hasError ? theme.palette.error.main : 'transparent'
      }`}
    >
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3">Payment Methods</Typography>
        </Grid>
        <Grid item>
          {isOpen ? (
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              aria-haspopup="true"
              color="primary"
              onClick={handleOpen}
              disabled={isOpen}
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <Collapse in={isOpen} collapsedHeight={collapsedHeight} timeout="auto">
        <Box>
          {selectedPaymentMethod ? (
            <Box mx={2}>
              <CreditCard paymentMethod={selectedPaymentMethod} />
            </Box>
          ) : (
            <Box p={2}>
              <Typography> No payment information on file. </Typography>
            </Box>
          )}
          <AddNewPayment onCreate={handleSelect} />
          <Box py={2}>
            <Divider />
          </Box>
          {selectedPaymentMethod && (
            <PaymentSelect
              name={name}
              onChange={handleSelect}
              paymentMethods={user ? user.payment : []}
              selected={selectedPaymentMethod}
            />
          )}
        </Box>
        <Container maxWidth="sm" disableGutters>
          <Box mt={2}>
            <PrimaryWallyButton onClick={handleClose} fullWidth>
              Save
            </PrimaryWallyButton>
          </Box>
        </Container>
      </Collapse>
      <HelperText error={hasError ? true : false}>
        {hasError ? meta.error : ' '}
      </HelperText>
    </Box>
  );
}

export default observer(PaymentMethods);

const StripeCardInput = lazy(() => import('common/StripeCardInput'));

function AddNewPayment({ onCreate }) {
  const { modalV2: modalV2Store } = useStores();

  const SuspenseFallback = () => (
    <>
      <Typography variant="h1" gutterBottom>
        Add New Payment
      </Typography>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  const handleClick = () => {
    modalV2Store.open(
      <Suspense fallback={SuspenseFallback()}>
        <Typography variant="h1" gutterBottom>
          New Payment Method
        </Typography>
        <StripeCardInput onAdd={onCreate} />
      </Suspense>,
      'left',
    );
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Box p={2}>
        <PrimaryWallyButton
          onClick={handleClick}
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add payment
        </PrimaryWallyButton>
      </Box>
    </Container>
  );
}
