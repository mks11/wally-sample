import React from 'react';
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Npm Package Components
import { Box, List } from '@material-ui/core';
import { MobileView, BrowserView } from 'react-device-detect';

// Custom Components
import { DesktopGuestNav, MobileGuestNav } from 'common/Header/NavBar/GuestNav';
import DesktopNav from 'common/Header/NavBar/DesktopNav';
import MobileNav from 'common/Header/NavBar/MobileNav';

function Navbar() {
  const { user } = useStores();
  const { status } = user;

  return (
    <Box display="flex" alignItems="center" component="nav">
      <MobileView>
        <List>{status ? <MobileNav /> : <MobileGuestNav />}</List>
      </MobileView>
      <BrowserView>{status ? <DesktopNav /> : <DesktopGuestNav />}</BrowserView>
    </Box>
  );
}

export default observer(Navbar);
