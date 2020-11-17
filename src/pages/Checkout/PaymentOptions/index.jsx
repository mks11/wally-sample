import React, { useEffect, useState } from 'react';
import CheckoutCard from './../BaseCheckoutCard';
import PaymentSelect from './PaymentSelect';
import { useStores } from 'hooks/mobx';
import CardSmall from './StripeCardInputSmall';
import { Box, Divider, Typography } from '@material-ui/core';
import CardInfo from './CardInfo';
import { observer } from 'mobx-react';
import { useFormikContext, setFieldValue } from 'formik';

function Payment({ name, options = [], onAdd }) {
  const [selectedPaymentId, setSelectedPaymentId] = useState();
  const { setFieldValue } = useFormikContext() || {};
  const [error, setError] = useState(false);
  const { user: userStore } = useStores();

  const preferredPaymentId = userStore.user.preferred_payment;
  useEffect(() => {
    if (!selectedPaymentId && preferredPaymentId) {
      setSelectedPaymentId(preferredPaymentId);
      return;
    }
    setSelectedPaymentId(selectedPaymentId);
  }, [options, selectedPaymentId]);

  const handleAdd = (id) => {
    setError(false);
    userStore
      .savePayment(id)
      .then((data) => {
        onAdd && onAdd(data);
      })
      .catch((er) => {
        setError(true);
        onAdd && onAdd(null);
      });
  };

  const handlePaymentSelect = (id) => {
    setSelectedPaymentId(id);
    setFieldValue && setFieldValue(name, id);
  };

  const selectedPayment =
    options.find((v) => v._id === selectedPaymentId) || {};

  const { brand, last4, exp_year, exp_month } = selectedPayment;

  return (
    <CheckoutCard title="Payment Options" collapsedHeight={142}>
      <Box my={3} mb={4}>
        {selectedPaymentId ? (
          <CardInfo
            brand={brand}
            last4={last4}
            exp_year={exp_year}
            exp_month={exp_month}
            isPreferred={preferredPaymentId === selectedPaymentId}
            showCVVInput
          />
        ) : (
          <Typography> Please select a payment option </Typography>
        )}
      </Box>
      <PaymentSelect
        options={options}
        selectedId={selectedPaymentId}
        onSelect={handlePaymentSelect}
      />
      <Divider />
      <Box p={2} my={2}>
        <CardSmall onAdd={handleAdd} />
      </Box>
      {error && (
        <Typography color="error"> Failed to add new payment </Typography>
      )}
    </CheckoutCard>
  );
}

export default observer(Payment);
