import React from 'react';
import { Box, Typography } from '@material-ui/core';

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
        </Typography>
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {street_address_unit},
        </Typography>
        <Typography style={isSelected && { fontWeight: 'bold' }}>
          {city}, {state} {zip}
        </Typography>
      </Box>
      <Box flexShrink={1}>
        {isPreferredAddress && (
          <Typography variant="h6" component="span">
            Preferred
          </Typography>
        )}
      </Box>
    </Box>
  );
}
