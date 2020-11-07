import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  Collapse,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddressList from './AddressList';
import Address from './Address';
import { Add, Edit } from '@material-ui/icons';
import { useStores } from 'hooks/mobx';
import { useFormikContext } from 'formik';

function AddressOptions({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);

  const { modalV2: modalV2Store, user: userStore } = useStores();
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

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!selected) {
      userStore.setDeliveryAddress(user.preferred_address);
    }
    const getAddresses = () => {
      const data = user.addresses || [];

      if (!isOpen) {
        return data.filter((_d) => _d.address_id === selected.address_id);
      } else {
        return data;
      }
    };
    setData(getAddresses());
  }, [selected, user, isOpen]);

  // automatically closes the Collapse on select change by the user
  useEffect(() => {
    if (selected) {
      setIsOpen(false);
    }
  }, [selected]);

  const handleAdd = () => {
    modalV2Store.open(<AddressCreateForm allowDelivery />);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Box mb={4}>
        <Card>
          <Box p={4}>
            <Typography variant="h2" gutterBottom>
              Shipping Address
            </Typography>
            <Box my={2}>
              <Grid container justify="flex-end" alignItems="center">
                <Grid item>
                  {!isOpen && selected ? (
                    <Button
                      color="primary"
                      onClick={handleOpen}
                      startIcon={<Edit />}
                      style={{ padding: '14.5px 12px' }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <IconButton onClick={handleClose} aria-label="close">
                      <CloseIcon fontSize="large" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Collapse in={isOpen} collapsedHeight={100} timeout="auto">
              {selected ? (
                <Address address={selected} isSelected />
              ) : (
                <Box>
                  <Typography variant="h6" color="error" gutterBottom>
                    No shipping address selected
                  </Typography>
                  <PrimaryWallyButton fullWidth onClick={handleAdd}>
                    Add an Address
                  </PrimaryWallyButton>
                </Box>
              )}
              <Box p={2}>
                <PrimaryWallyButton
                  onClick={handleAdd}
                  fullWidth
                  variant="outlined"
                  startIcon={<Add />}
                  style={{ padding: '0.5rem 0' }}
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
