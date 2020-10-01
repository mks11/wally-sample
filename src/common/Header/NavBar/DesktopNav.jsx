import React from 'react';

// Custom Components
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';
import { DesktopOpsNav } from './OpsNav';
import { DesktopRetailNav } from './Retail';

function DesktopNav() {
  return (
    <>
      <DesktopUserNav />
      <DesktopAdminNav />
      <DesktopOpsNav />
      <DesktopRetailNav />
    </>
  );
}

export default DesktopNav;
