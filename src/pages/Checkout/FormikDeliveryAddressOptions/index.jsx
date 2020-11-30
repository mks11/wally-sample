import React, { lazy, Suspense, useState, useEffect } from 'react';
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
  const [data, setData] = useState([]);
  const { user: userStore } = useStores();
  const { user = {} } = userStore;
  const { setFieldValue } = useFormikContext() || {};
  const selected = userStore.selectedDeliveryAddress;
  const collapsedHeight = selected ? 100 : 50;

  const handleSelect = (address) => {
    const a = JSON.parse(address);
    userStore.setDeliveryAddress(a);
    setFieldValue && setFieldValue(name, a._id);
  };

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  useEffect(() => {
    if (!selected && user) {
      userStore.setDeliveryAddress(user.preferred_address);
    }
  }, [selected, user, userStore]);

  function loadAddresses() {
    setData(user.addresses || []);
  }

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
      <AddNewAddress />
      <AddressList
        addresses={data}
        defaultAddressId={user.preferred_address}
        name={name}
        onChange={handleSelect}
        selected={selected}
      />
    </CheckoutCard>
  );
}

AddressOptions.propTypes = {
  name: PropTypes.string.isRequired,
};

export default observer(AddressOptions);

function AddNewAddress() {
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
        <AddressCreateForm />
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
