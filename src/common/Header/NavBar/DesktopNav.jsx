import React from 'react';

// Custom Components
import { DesktopGuestNav } from 'common/Header/NavBar/GuestNav';
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';
import { DesktopOpsNav } from './OpsNav';
import { DesktopRetailNav } from './Retail';

// Material Ui
import { Box } from '@material-ui/core';

function DesktopNav() {
  return (
    <Box display="flex">
      <DesktopGuestNav />
      <DesktopUserNav />
      <DesktopAdminNav />
      <DesktopOpsNav />
      <DesktopRetailNav />
    </Box>
  );
}

export default DesktopNav;
