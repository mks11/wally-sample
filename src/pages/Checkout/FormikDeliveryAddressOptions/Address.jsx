import React from 'react';
import { Box, Typography } from '@material-ui/core';

export default function Address({ address = {}, isPreferredAddress }) {
  const { street_address, unit, state, zip, name, telephone } = address;
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
        <Typography variant="body1">
          {street_address_unit}, {state} {zip}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {name}, {telephone}
        </Typography>
      </Box>
      <Box flexShrink={1}>
        {isPreferredAddress && (
          <Typography variant="h6" component="span" color="primary">
            DEFAULT
          </Typography>
        )}
      </Box>
    </Box>
  );
}
