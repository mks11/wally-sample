import React, { lazy, Suspense } from 'react';
import CollapseCard from 'common/FormikComponents/NonRenderPropAPI/CollapseCard';
import PaymentSelect from 'common/PaymentSelect';
import { useStores } from 'hooks/mobx';
import { Box, Container, Divider, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CreditCard } from 'common/PaymentMethods';
import { observer } from 'mobx-react';
import { useFormikContext } from 'formik';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

function Payment({ onSave, name }) {
  const { user: userStore } = useStores();
  const { user = {} } = userStore;
  const { values, setFieldValue } = useFormikContext() || {};

  // Will be equal to a stringified object id
  const paymentMethodId = values[name];
  const selectedPaymentMethod = user
    ? user.payment.find((p) => p._id === paymentMethodId)
    : '';
  const showSaveButton = user && user.payment && user.payment.length >= 3;

  const handleSelect = (paymentMethodId) => {
    setFieldValue && setFieldValue(name, paymentMethodId);
  };

  return (
    <CollapseCard
      title="Payment"
      collapsedHeight={50}
      name={name}
      onSave={onSave}
      showSaveButton={showSaveButton}
    >
      {selectedPaymentMethod ? (
        <Box pl={1}>
          <CreditCard paymentMethod={selectedPaymentMethod} />
        </Box>
      ) : (
        <Box p={2}>
          <Typography> No payment information on file. </Typography>
        </Box>
      )}
      <AddNewPayment onCreate={handleSelect} />

      {selectedPaymentMethod && (
        <>
          <Box py={2}>
            <Divider />
          </Box>
          <PaymentSelect
            name={name}
            onChange={handleSelect}
            paymentMethods={user ? user.payment : []}
            selected={selectedPaymentMethod}
          />
        </>
      )}
    </CollapseCard>
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
