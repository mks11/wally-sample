import React from 'react';
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Npm Package Components
import { Box, List, Typography } from '@material-ui/core';

// Custom Components
import { DesktopGuestNav, MobileGuestNav } from 'common/Header/NavBar/GuestNav';
import DesktopNav from 'common/Header/NavBar/DesktopNav';
import MobileNav from 'common/Header/NavBar/MobileNav';

function Navbar() {
  const { user } = useStores();
  const isLoggedIn = user.status;
  return (
    <Box display="flex" alignItems="center" component="nav">
      {/* {isLoggedIn ? <DesktopNav /> : <DesktopGuestNav />} */}
      <List>{isLoggedIn ? <MobileNav /> : <MobileGuestNav />}</List>
    </Box>
  );
}

export default observer(Navbar);
