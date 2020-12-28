import React from 'react';
import { Badge, Box, Typography } from '@material-ui/core';
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

export default function Address({ address = {}, preferredAddressId }) {
  const {
    _id,
    street_address,
    unit,
    city,
    state,
    zip,
    name,
    telephone,
  } = address;
  const isPreferredAddress = _id.toString() === preferredAddressId;

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
}
