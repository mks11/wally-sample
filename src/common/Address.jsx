import React, { useState } from 'react';

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

  const isPreferredAddress =
    userStore && userStore.preferred_address === address._id;

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
          {!isActive && <StyledBadge badgeContent="Inactive" color="error" />}
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

export function Address({ address = {} }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { is_active } = address;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDefaultAddress = () => {};
  const handleReactivateAddress = () => {};
  const handleDeactivateAddress = () => {};

  return (
    <Box my={2}>
      <ListItem>
        <Grid container justify="space-between">
          <Grid item xs={12} lg={3}>
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
              {is_active && (
                <MenuItem onClick={handleDefaultAddress}>Make Default</MenuItem>
              )}
              {is_active && (
                <MenuItem onClick={handleDeactivateAddress}>
                  Deactivate
                </MenuItem>
              )}
              {!is_active && (
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
