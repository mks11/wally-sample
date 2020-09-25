import React from 'react';
import { useStores } from 'hooks/mobx';

// Npm Package Components
import { Box, Typography } from '@material-ui/core';

// Custom Components
import { DesktopGuestNav } from 'common/Header/NavBar/GuestNav';

export default function Navbar() {
  const {
    store: { user },
  } = useStores();
  const isLoggedIn = user.status;

  return (
    <Box display="flex" alignItems="center" component="nav">
      {isLoggedIn ? <Typography>Foo</Typography> : <DesktopGuestNav />}
    </Box>
  );
}
