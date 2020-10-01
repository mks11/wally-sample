import React from 'react';

// npm Package Components
import { List } from '@material-ui/core';

// Custom Components
import { MobileUserNav } from './UserNav';
// import { MobileAdminNav } from './AdminNav';
// import { MobileOpsNav } from './OpsNav';
// import { MobileRetailNav } from './Retail';

function MobileNav() {
  return (
    <List>
      <MobileUserNav />
      {/* <MobileAdminNav /> */}
      {/* <MobileOpsNav /> */}
      {/* <MobileRetailNav /> */}
    </List>
  );
}

export default MobileNav;
