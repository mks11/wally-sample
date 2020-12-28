import React from 'react';
import { Badge, Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

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

function Address({ address = {} }) {
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
}

export default observer(Address);
