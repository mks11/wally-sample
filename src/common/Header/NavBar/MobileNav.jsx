import React from 'react';

// Custom Components
import { MobileUserNav } from './UserNav';
import { MobileAdminNav } from './AdminNav';
import { MobileOpsNav } from './OpsNav';
import { MobileRetailNav } from './Retail';

function MobileNav() {
  return (
    <>
      <MobileUserNav />
      <MobileAdminNav />
      <MobileOpsNav />
      <MobileRetailNav />
    </>
  );
}

export default MobileNav;
