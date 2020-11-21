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

export default function Address({
  address = {},
  isPreferredAddress,
  isSelected,
}) {
  const { street_address, unit, city, state, zip, name, telephone } = address;
  const street_address_unit = (street_address + ' ' + unit).trim(); // handles formatting when unit is not present
  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      alignItems="flex-start"
      justifyContent="space-between"
      p={1}
    >
      <Box flexGrow={1} width="100%">
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {name}
          {isPreferredAddress && (
            <StyledBadge badgeContent="Default" color="primary" />
          )}
        </Typography>
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {street_address_unit},
        </Typography>
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {city}, {state} {zip}
        </Typography>
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {telephone}
        </Typography>
      </Box>
    </Box>
  );
}
