import React from 'react';

// Npm Package Components
import { Box } from '@material-ui/core';
import { isMobile } from 'react-device-detect';

// Custom Components
import DesktopNav from 'common/Header/NavBar/DesktopNav';
import MobileNav from 'common/Header/NavBar/MobileNav';

export default function Navbar() {
  return (
    <Box display="flex" alignItems="center" component="nav">
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </Box>
  );
}
