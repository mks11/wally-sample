import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import {
  Box,
  Card,
  Container,
  Grid,
  IconButton,
  Typography,
  Collapse,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddressList from './AddressList';
import Address from './Address';
import { Add, ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons';
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

  const handleAdd = () => {
    modalV2Store.open(<AddressCreateForm allowDelivery />);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Box mb={4}>
        <Card>
          <Box p={4}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h2">Shipping Address</Typography>
              </Grid>
              <Grid item>
                {isOpen ? (
                  <IconButton onClick={handleClose} aria-label="close">
                    <CloseIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-controls="shipping-address-menu"
                    aria-haspopup="true"
                    color="primary"
                    onClick={handleOpen}
                    disabled={isOpen}
                  >
                    <ArrowDropDownIcon fontSize="large" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Collapse in={isOpen} collapsedHeight={100} timeout="auto">
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
                    startIcon={<Add />}
                    style={{ padding: '0.5rem 0' }}
                  >
                    Add address
                  </PrimaryWallyButton>
                </Box>
              </Container>
              <AddressList
                addresses={data}
                selected={selected}
                preferred_address={user.preferred_address}
                onChange={handleSelect}
              />
              <Container maxWidth="sm">
                <Box mt={2}>
                  <PrimaryWallyButton onClick={handleClose} fullWidth>
                    Save
                  </PrimaryWallyButton>
                </Box>
              </Container>
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
