import React, { lazy, Suspense, useState } from 'react';

//MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Material UI
import {
  Box,
  Grid,
  Typography,
  Badge,
  ListItem,
  Menu,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

// Utilities
import { getErrorMessage } from 'utils';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -40,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '8px',
    color: '#FFF',
    fontFamily: ['Sofia Pro', 'sans-serif'].join(),
    fontWeight: 'bold',
  },
}))(Badge);

const AddressDetail = observer(({ address = {}, isActive }) => {
  const { street_address, unit, city, state, zip, name, telephone } = address;

  const { user: userStore } = useStores();
  const { user } = userStore;
  const isPreferredAddress = user && user.preferred_address === address._id;

  // handles formatting when unit is not present
  var streetAddress = street_address;
  if (unit) {
    streetAddress += ' ' + unit;
  }

  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      alignItems="flex-start"
      justifyContent="space-between"
      p={1}
    >
      <Box flexGrow={1} width="100%">
        <Typography>
          {name}
          {isPreferredAddress && (
            <StyledBadge badgeContent="Default" color="primary" />
          )}
          {isActive === false && (
            <StyledBadge badgeContent="Inactive" color="error" />
          )}
        </Typography>
        <Typography>{streetAddress && streetAddress.trim()},</Typography>
        <Typography>
          {city}, {state} {zip}
        </Typography>
        <Typography>{telephone}</Typography>
      </Box>
    </Box>
  );
});

export default AddressDetail;

const UpdateAddressForm = lazy(() => import('forms/Address/Update'));

export function Address({ address = {} }) {
  const {
    loading,
    modalV2: modalV2Store,
    snackbar,
    user: userStore,
  } = useStores();
  const [anchorEl, setAnchorEl] = useState(null);
  const { _id, is_active } = address;
  const ADDRESS_API_BODY = {
    _id,
    name: address.name,
    telephone: address.telephone,
    streetAddress: address.street_address,
    unit: address.unit,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDefaultAddress = async () => {
    const data = { ...ADDRESS_API_BODY, isPreferredAddress: true };
    try {
      setAnchorEl(null);
      loading.show();
      await userStore.updateAddress(data);
      snackbar.openSnackbar('Default address updated successfully!', 'success');
    } catch (error) {
      const msg = getErrorMessage(error);

      if (msg) {
        snackbar.openSnackbar(msg, 'error');
      } else {
        snackbar.openSnackbar('Failed to update default address.', 'error');
      }
    } finally {
      loading.hide();
    }
  };

  const handleDeactivateAddress = async () => {
    const data = { ...ADDRESS_API_BODY, isActive: false };
    try {
      setAnchorEl(null);
      loading.show();
      await userStore.updateAddress(data);
      snackbar.openSnackbar('Address deactivated successfully!', 'success');
    } catch (error) {
      const msg = getErrorMessage(error);

      if (msg) {
        snackbar.openSnackbar(msg, 'error');
      } else {
        snackbar.openSnackbar('Failed to update default address.', 'error');
      }
    } finally {
      loading.hide();
    }
  };

  const handleUpdateAddress = () => {
    setAnchorEl(null);
    modalV2Store.open(
      <Suspense fallback={SuspenseFallback()}>
        <UpdateAddressForm addressId={_id} />
      </Suspense>,
      'right',
    );
  };

  const handleReactivateAddress = async () => {
    const data = { ...ADDRESS_API_BODY, isActive: true };
    try {
      setAnchorEl(null);
      loading.show();
      await userStore.updateAddress(data);
      snackbar.openSnackbar('Address deactivated successfully!', 'success');
    } catch (error) {
      const msg = getErrorMessage(error);

      if (msg) {
        snackbar.openSnackbar(msg, 'error');
      } else {
        snackbar.openSnackbar('Failed to update default address.', 'error');
      }
    } finally {
      loading.hide();
    }
  };

  const SuspenseFallback = () => (
    <>
      <Typography variant="h1" gutterBottom>
        Update Address
      </Typography>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  return (
    <Box my={2}>
      <ListItem>
        <Grid container justify="space-between">
          <Grid item>
            <AddressDetail address={address} isActive={is_active} />
          </Grid>
          <Grid item>
            <IconButton onClick={handleClick}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id="address-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {is_active !== false && (
                <MenuItem onClick={handleDefaultAddress}>Make Default</MenuItem>
              )}
              {is_active !== false && (
                <MenuItem onClick={handleUpdateAddress}>Edit</MenuItem>
              )}
              {is_active !== false && (
                <MenuItem onClick={handleDeactivateAddress}>
                  Deactivate
                </MenuItem>
              )}
              {is_active === false && (
                <MenuItem onClick={handleReactivateAddress}>
                  Reactivate
                </MenuItem>
              )}
            </Menu>
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
}
