import React from 'react';

import { List } from '@material-ui/core';

// Custom Components
import { MobileGuestNav } from 'common/Header/NavBar/GuestNav';
import { MobileUserNav } from './UserNav';
import { MobileAdminNav } from './AdminNav';
import { MobileOpsNav } from './OpsNav';
import { MobileRetailNav } from './Retail';

function MobileNav() {
  return (
    <List>
      <MobileGuestNav />
      <MobileUserNav />
      <MobileAdminNav />
      <MobileOpsNav />
      <MobileRetailNav />
    </List>
  );
}

export default MobileNav;
