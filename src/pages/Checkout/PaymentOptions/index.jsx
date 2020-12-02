import React, { lazy, Suspense, useEffect } from 'react';
import CheckoutCard from './../BaseCheckoutCard';
import PaymentSelect from 'common/PaymentSelect';
import { useStores } from 'hooks/mobx';
import { Box, Container, Divider, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CreditCard } from 'common/PaymentMethods';
import { observer } from 'mobx-react';
import { useFormikContext } from 'formik';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

function Payment({ name }) {
  const { user: userStore } = useStores();
  const { user = {} } = userStore;
  const selected = userStore.selectedPaymentMethod;
  const collapsedHeight = selected ? 80 : 50;
  const { setFieldValue } = useFormikContext() || {};

  useEffect(() => {
    if (!selected && user && user.preferred_payment) {
      const { preferred_payment } = user;
      const preferredPaymentMethod = user.payment.find(
        (p) => p._id === preferred_payment,
      );
      userStore.setPaymentMethod(preferredPaymentMethod);
    }
  }, [selected, user, userStore]);

  const handleSelect = (paymentMethod) => {
    const p = JSON.parse(paymentMethod);
    userStore.setPaymentMethod(p);
    setFieldValue && setFieldValue(name, p._id);
  };

  return (
    <CheckoutCard title="Payment" collapsedHeight={collapsedHeight} name={name}>
      {selected ? (
        <CreditCard paymentMethod={selected} />
      ) : (
        <Box p={2}>
          <Typography> No payment information on file. </Typography>
        </Box>
      )}
      <AddNewPayment onCreate={handleSelect} />
      <Box py={2}>
        <Divider />
      </Box>
      {selected && (
        <PaymentSelect
          name={name}
          onChange={handleSelect}
          paymentMethods={user ? user.payment : []}
          selected={selected}
        />
      )}
    </CheckoutCard>
  );
}

export default observer(Payment);

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
