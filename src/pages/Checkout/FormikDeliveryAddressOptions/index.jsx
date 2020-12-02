import React, { lazy, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Box, Container, Typography } from '@material-ui/core';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import Address from './Address';
import AddressList from './AddressList';
import { AddIcon } from 'Icons';
import CheckoutCard from 'pages/Checkout/BaseCheckoutCard';

// Forms
import { useFormikContext } from 'formik';

// Addresses
const AddressCreateForm = lazy(() => import('forms/Address/Create'));

function AddressOptions({ name }) {
  const { user: userStore } = useStores();
  const { user = {} } = userStore;
  const selected = userStore.selectedDeliveryAddress;
  const collapsedHeight = selected ? 100 : 50;
  const { setFieldValue } = useFormikContext() || {};

  const handleSelect = (address) => {
    const a = JSON.parse(address);
    userStore.setDeliveryAddress(a);
    setFieldValue && setFieldValue(name, a._id);
  };

  useEffect(() => {
    if (!selected && user && user.preferred_address) {
      const { preferred_address } = user;
      const preferredAddress = user.addresses.find(
        (a) => a._id === preferred_address,
      );
      userStore.setDeliveryAddress(preferredAddress);
    }
  }, [selected, user, userStore]);

  return (
    <CheckoutCard
      collapsedHeight={collapsedHeight}
      title="Delivery Address"
      name={name}
    >
      {selected ? (
        <Address address={selected} />
      ) : (
        <Box p={2}>
          <Typography>No shipping address selected.</Typography>
        </Box>
      )}
      <AddNewAddress onCreate={handleSelect} />
      {selected && (
        <AddressList
          addresses={user ? user.addresses : []}
          defaultAddressId={user ? user.preferred_address : null}
          name={name}
          onChange={handleSelect}
          selected={selected}
        />
      )}
    </CheckoutCard>
  );
}

AddressOptions.propTypes = {
  name: PropTypes.string.isRequired,
};

export default observer(AddressOptions);

function AddNewAddress({ onCreate }) {
  const { modalV2: modalV2Store } = useStores();

  const SuspenseFallback = () => (
    <>
      <Typography variant="h1" gutterBottom>
        Add New Address
      </Typography>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  const handleAddNewAddress = () => {
    modalV2Store.open(
      <Suspense fallback={SuspenseFallback()}>
        <AddressCreateForm onCreate={onCreate} />
      </Suspense>,
      'left',
    );
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Box p={2}>
        <PrimaryWallyButton
          onClick={handleAddNewAddress}
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add address
        </PrimaryWallyButton>
      </Box>
    </Container>
  );
}
