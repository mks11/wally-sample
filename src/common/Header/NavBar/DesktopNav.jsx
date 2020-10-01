import React from 'react';

// Custom Components
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';

function DesktopNav() {
  return (
    <>
      <DesktopUserNav />
      <DesktopAdminNav />
    </>
  );
}

export default DesktopNav;
