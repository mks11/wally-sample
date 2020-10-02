import React from 'react';

// Custom Components
import { DesktopGuestNav } from 'common/Header/NavBar/GuestNav';
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';
import { DesktopOpsNav } from './OpsNav';
import { DesktopRetailNav } from './Retail';

function DesktopNav() {
  return (
    <>
      <DesktopGuestNav />
      <DesktopUserNav />
      <DesktopAdminNav />
      <DesktopOpsNav />
      <DesktopRetailNav />
    </>
  );
}

export default DesktopNav;
