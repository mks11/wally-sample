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

export default observer(({ address = {} }) => {
  const { street_address, unit, city, state, zip, name, telephone } = address;

  const { user: userStore } = useStores();

  const isPreferredAddress = userStore && userStore.preferred_address;

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
        </Typography>
        <Typography>{streetAddress.trim()},</Typography>
        <Typography>
          {city}, {state} {zip}
        </Typography>
        <Typography>{telephone}</Typography>
      </Box>
    </Box>
  );
});

export function Address({ address: data = {} }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { is_active } = data;

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
            <AddressDetail data={data} />
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

function AddressDetail({ data = {} }) {
  return (
    <>
      <Typography variant="h4" component="h3">
        {data.street_address} {data.unit}, {data.state} {data.zip}
      </Typography>
      <Typography variant="body1"> {data.name} </Typography>
      <Typography variant="body1" gutterBottom>
        {data.telephone}
      </Typography>
    </>
  );
}
