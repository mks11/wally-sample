import React from 'react';
import styled from 'styled-components';

import { List } from '@material-ui/core';

// Custom Components
import { MobileGuestNav } from 'common/Header/NavBar/GuestNav';
import { MobileUserNav } from './UserNav';
import { MobileAdminNav } from './AdminNav';
import { MobileOpsNav } from './OpsNav';
import { MobileRetailNav } from './Retail';

const MobileNavWrapper = styled(List)`
  @media only screen and (max-width: 767px) {
    display: block;
  }

  display: none;
`;

function MobileNav() {
  return (
    <MobileNavWrapper>
      <MobileGuestNav />
      <MobileUserNav />
      <MobileAdminNav />
      <MobileOpsNav />
      <MobileRetailNav />
    </MobileNavWrapper>
  );
}

export default MobileNav;
