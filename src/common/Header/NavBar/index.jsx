import React from 'react';
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Npm Package Components
import { Box, Typography } from '@material-ui/core';

// Custom Components
import { DesktopGuestNav } from 'common/Header/NavBar/GuestNav';
import DesktopNav from 'common/Header/NavBar/DesktopNav';

function Navbar() {
  const { user } = useStores();
  const isLoggedIn = user.status;
  console.log(isLoggedIn);
  return (
    <Box display="flex" alignItems="center" component="nav">
      {isLoggedIn ? <DesktopNav /> : <DesktopGuestNav />}
    </Box>
  );
}

export default observer(Navbar);
