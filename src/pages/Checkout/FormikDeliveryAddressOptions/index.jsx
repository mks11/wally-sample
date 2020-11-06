import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Button, Card, Typography, Collapse } from '@material-ui/core';
import AddressList from './AddressList';
import Address from './Address';
import { Add, Edit } from '@material-ui/icons';
import { useStores } from 'hooks/mobx';
import { useFormikContext } from 'formik';

function AddressOptions({ name }) {
  const [lock, setLock] = useState(true);
  const [data, setData] = useState([]);

  const { modalV2, user: userStore } = useStores();
  const { user = {} } = userStore;
  const { setFieldValue } = useFormikContext() || {};
  const selected = userStore.selectedDeliveryAddress;

  const handleSelect = (address_id) => {
    userStore.setDeliveryAddress(addrById(address_id));
    setFieldValue && setFieldValue(name, address_id);
  };

  const addrById = (id) => {
    return user.addresses.find((a) => a.address_id === id);
  };

  const handleSubmit = () => {
    setLock(true);
  };

  useEffect(() => {
    if (!selected) {
      userStore.setDeliveryAddress(user.preferred_address);
    }
    const getAddresses = () => {
      const data = user.addresses || [];

      if (lock) {
        return data.filter((_d) => _d.address_id === selected.address_id);
      } else {
        return data;
      }
    };
    setData(getAddresses());
  }, [selected, user, lock]);

  // automatically closes the Collapse on select change by the user
  useEffect(() => {
    if (selected) {
      setLock(true);
    }
  }, [selected]);

  const handleAdd = () => {
    modalV2.open(<AddressCreateForm allowDelivery />);
  };

  const unlock = () => {
    setLock(false);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Shipping Address
        </Typography>
        {lock && selected && (
          <Button
            style={{ marginBottom: '0.5rem' }}
            color="primary"
            onClick={unlock}
            startIcon={<Edit />}
          >
            <Typography variant="h6">EDIT</Typography>
          </Button>
        )}
      </Box>
      <Box mb={4}>
        <Card>
          <Box p={2}>
            <Collapse
              in={!lock}
              collapsedHeight={84}
              timeout={{
                enter: 600,
                exit: 400,
              }}
            >
              {lock ? (
                selected ? (
                  <Address address={selected} />
                ) : (
                  <Box>
                    <Typography variant="h6" color="error" gutterBottom>
                      No shipping address selected
                    </Typography>
                    <PrimaryWallyButton fullWidth onClick={handleAdd}>
                      Add an Address
                    </PrimaryWallyButton>
                  </Box>
                )
              ) : (
                <>
                  <Box mb={2}>
                    <PrimaryWallyButton
                      onClick={handleAdd}
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                    >
                      Add New Address
                    </PrimaryWallyButton>
                  </Box>
                  <AddressList
                    addresses={data}
                    selected={selected}
                    preferred_address={user.preferred_address}
                    onChange={handleSelect}
                  />
                  <Box mt={1}>
                    {selected && (
                      <PrimaryWallyButton fullWidth onClick={handleSubmit}>
                        <Typography variant="h4" component="span">
                          Submit
                        </Typography>
                      </PrimaryWallyButton>
                    )}
                  </Box>
                </>
              )}
            </Collapse>
          </Box>
        </Card>
      </Box>
    </>
  );
}

AddressOptions.propTypes = {
  name: PropTypes.string.isRequired,
};

export default observer(AddressOptions);
