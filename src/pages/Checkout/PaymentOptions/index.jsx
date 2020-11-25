import React, { useEffect, useState } from 'react';
import CheckoutCard from './../BaseCheckoutCard';
import PaymentSelect from 'common/PaymentSelect';
import { useStores } from 'hooks/mobx';
import StripeCardInput from 'common/StripeCardInput';
import { Box, Container, Divider, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CreditCard } from 'common/PaymentMethods';
import { observer } from 'mobx-react';
import { useFormikContext } from 'formik';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

function Payment({ name, options = [], onAdd }) {
  const { modalV2: modalV2Store, user: userStore } = useStores();
  const [selectedPaymentId, setSelectedPaymentId] = useState(undefined);
  const { setFieldValue } = useFormikContext() || {};
  const [error, setError] = useState(false);

  const preferredPaymentId = userStore.user.preferred_payment;
  useEffect(() => {
    if (!selectedPaymentId && preferredPaymentId) {
      setSelectedPaymentId(preferredPaymentId);
      return;
    }
  }, [options, selectedPaymentId]);

  const handlePaymentSelect = (id) => {
    setSelectedPaymentId(id);
    setFieldValue && setFieldValue(name, id);
  };

  const openCreateCardModal = () => {
    modalV2Store.open(
      <>
        <Typography variant="h1" gutterBottom>
          New Payment Method
        </Typography>
        <StripeCardInput onAdd={handlePaymentSelect} />
      </>,
      'left',
    );
  };

  const selectedPayment =
    options.find((v) => v._id === selectedPaymentId) || {};
  const { last4 } = selectedPayment;
  const collapsedHeight = last4 ? 80 : 10;
  return (
    <CheckoutCard
      title="Payment"
      collapsedHeight={collapsedHeight}
      isDisabled={last4 ? false : true}
      name={name}
    >
      <Box p={1}>
        {selectedPaymentId ? (
          <CreditCard paymentMethod={selectedPayment} />
        ) : (
          <Typography> No payment information on file. </Typography>
        )}
      </Box>
      <Box p={1}>
        <Container maxWidth="xs" disableGutters>
          <Box display="flex" justifyContent="center">
            <PrimaryWallyButton
              variant="outlined"
              onClick={openCreateCardModal}
            >
              <AddIcon />
              Add Payment Method
            </PrimaryWallyButton>
          </Box>
        </Container>
      </Box>
      <Box py={2}>
        <Divider />
      </Box>
      <PaymentSelect
        options={options}
        selectedId={selectedPaymentId}
        onSelect={handlePaymentSelect}
      />

      {error && (
        <Typography color="error"> Failed to add new payment </Typography>
      )}
    </CheckoutCard>
  );
}

export default observer(Payment);
