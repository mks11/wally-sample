import React from 'react';

// Npm Package Components
import { Box } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';

// Custom Components
import DesktopNav from 'common/Header/NavBar/DesktopNav';
import MobileNav from 'common/Header/NavBar/MobileNav';

export default function Navbar() {
  const shouldDisplayMobileNav = useMediaQuery({ query: '(max-width:820px)' });

  return (
    <Box display="flex" alignItems="center" component="nav">
      {shouldDisplayMobileNav ? <MobileNav /> : <DesktopNav />}
    </Box>
  );
}
