import React, { lazy, Suspense } from 'react';

// Forms
import { useFormikContext } from 'formik';

// Custom Components
import Address from './Address';
import AddressList from './AddressList';
import { AddIcon } from 'Icons';
import CollapseCard from 'common/FormikComponents/NonRenderPropAPI/CollapseCard';

// Material UI
import { Box, Container, Divider, Typography } from '@material-ui/core';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// Addresses
const AddressCreateForm = lazy(() => import('forms/Address/Create'));

function ShippingAddresses({ onSave, name }) {
  const { user: userStore } = useStores();
  const { user } = userStore;
  const { values, setFieldValue } = useFormikContext() || {};
  const showSaveButton = user && user.addresses && user.addresses.length >= 3;

  // will be equal to a stringified object id
  const addressId = values[name];
  const collapsedHeight = addressId ? 100 : 50;
  const selectedAddress =
    user && addressId ? user.addresses.find((a) => a._id === addressId) : '';

  const handleSelect = (addressId) => {
    setFieldValue && setFieldValue(name, addressId);
  };

  return (
    <CollapseCard
      collapsedHeight={collapsedHeight}
      onSave={onSave}
      name="addressId"
      showSaveButton={showSaveButton}
      title="Shipping Address"
    >
      <Box>
        {selectedAddress ? (
          <Address
            address={selectedAddress}
            isPreferredAddress={addressId === user.preferred_address}
          />
        ) : (
          <Box p={2}>
            <Typography>No shipping address selected.</Typography>
          </Box>
        )}
        <AddNewAddress onCreate={handleSelect} />
        {selectedAddress && (
          <>
            <Box py={2}>
              <Divider />
            </Box>
            <AddressList
              addresses={user ? user.addresses : []}
              defaultAddressId={user ? user.preferred_address : null}
              name={name}
              onChange={handleSelect}
              selected={selectedAddress}
            />
          </>
        )}
      </Box>
    </CollapseCard>
  );
}
export default observer(ShippingAddresses);

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
