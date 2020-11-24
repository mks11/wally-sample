import React, { useEffect, useState } from 'react';
import CheckoutCard from './../BaseCheckoutCard';
import PaymentSelect from 'common/PaymentSelect';
import { useStores } from 'hooks/mobx';
import StripeCardInput from 'common/StripeCardInput';
import { Box, Divider, Typography } from '@material-ui/core';
import { AddIcon, KeyboardArrowLeftIcon } from 'Icons';
import { CreditCard } from 'common/PaymentMethods';
import { observer } from 'mobx-react';
import { useFormikContext } from 'formik';
import {
  PrimaryTextButton,
  PrimaryWallyButton,
} from 'styled-component-lib/Buttons';

function Payment({ name, options = [], onAdd }) {
  const { modalV2: modalV2Store, user: userStore } = useStores();
  const [selectedPaymentId, setSelectedPaymentId] = useState(undefined);
  const { setFieldValue } = useFormikContext() || {};
  const [error, setError] = useState(false);
  const preferredPaymentId = userStore.user.preferred_payment;
  const selectedPayment =
    options.find((v) => v._id === selectedPaymentId) || {};
  const { last4 } = selectedPayment;

  useEffect(() => {
    if (!selectedPaymentId && preferredPaymentId) {
      setSelectedPaymentId(preferredPaymentId);
      return;
    }
  }, [options, selectedPaymentId]);

  useEffect(() => {
    handleOpenPaymentSelect();
  }, [selectedPaymentId]);

  const handlePaymentSelect = (id) => {
    console.log(id);
    setSelectedPaymentId(id);
    setFieldValue && setFieldValue(name, id);
  };

  const handleClose = () => {
    modalV2Store.close();
  };

  const handleOpenPaymentSelect = () => {
    modalV2Store.open(
      <>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h1">Payment</Typography>
          <PrimaryWallyButton onClick={openCreateCardModal}>
            <AddIcon />
            New
          </PrimaryWallyButton>
        </Box>
        <Box py={2}>
          <Divider />
        </Box>
        <PaymentSelect
          options={options}
          selectedId={selectedPaymentId}
          onSelect={handlePaymentSelect}
        />
        <Box mt={2}>
          <PrimaryWallyButton onClick={handleClose} fullWidth>
            Save
          </PrimaryWallyButton>
        </Box>
      </>,
      'left',
    );
  };

  function openCreateCardModal() {
    modalV2Store.open(
      <>
        <Box my={2}>
          <PrimaryTextButton
            onClick={handleOpenPaymentSelect}
            startIcon={<KeyboardArrowLeftIcon />}
          >
            Back
          </PrimaryTextButton>
        </Box>
        <Typography variant="h1" gutterBottom>
          New Payment Method
        </Typography>
        <StripeCardInput onAdd={handlePaymentSelect} />
      </>,
      'left',
    );
  }

  return (
    <CheckoutCard
      title="Payment"
      handleOpen={handleOpenPaymentSelect}
      isDisabled={last4 ? false : true}
    >
      <Box p={1}>
        {selectedPaymentId ? (
          <CreditCard paymentMethod={selectedPayment} />
        ) : (
          <Typography> No payment information on file. </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error"> Failed to add new payment </Typography>
      )}
    </CheckoutCard>
  );
}

export default observer(Payment);
