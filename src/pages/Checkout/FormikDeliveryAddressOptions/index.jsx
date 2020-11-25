import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Container, Typography } from '@material-ui/core';
import AddressList from './AddressList';
import Address from './Address';
import { AddIcon } from 'Icons';
import { useStores } from 'hooks/mobx';
import CheckoutCard from 'pages/Checkout/BaseCheckoutCard';

// Forms
import { useFormikContext } from 'formik';
function AddressOptions({ name }) {
  const [data, setData] = useState([]);
  const { modalV2: modalV2Store, user: userStore } = useStores();
  const { user = {} } = userStore;
  const { setFieldValue } = useFormikContext() || {};
  const selected = userStore.selectedDeliveryAddress;

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

  const handleAdd = () => {
    modalV2Store.open(<AddressCreateForm onCreate={handleSelect} />, 'left');
  };

  return (
    <CheckoutCard title="Delivery Address" name={name}>
      {selected ? (
        <Address address={selected} isSelected />
      ) : (
        <Box p={2}>
          <Typography variant="h6" color="error" gutterBottom>
            No shipping address selected
          </Typography>
          <PrimaryWallyButton fullWidth onClick={handleAdd}>
            Add address
          </PrimaryWallyButton>
        </Box>
      )}
      <Container maxWidth="sm">
        <Box p={2}>
          <PrimaryWallyButton
            onClick={handleAdd}
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            style={{ padding: '0.5rem 0' }}
          >
            Add address
          </PrimaryWallyButton>
        </Box>
      </Container>
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
