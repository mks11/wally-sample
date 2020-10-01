import React from 'react';

// Custom Components
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';
import { DesktopOpsNav } from './OpsNav';

function DesktopNav() {
  return (
    <>
      <DesktopUserNav />
      <DesktopAdminNav />
      <DesktopOpsNav />
    </>
  );
}

export default DesktopNav;
