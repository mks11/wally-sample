import React from 'react';
import styled from 'styled-components';

import { Box } from '@material-ui/core';

// Custom Components
import { DesktopGuestNav } from 'common/Header/NavBar/GuestNav';
import { DesktopUserNav } from './UserNav';
import { DesktopAdminNav } from './AdminNav';
import { DesktopOpsNav } from './OpsNav';
import { DesktopRetailNav } from './Retail';

const DesktopNavWrapper = styled(Box)`
  display: none;
  @media only screen and (min-width: 768px) {
    display: flex;
  }
`;

function DesktopNav() {
  return (
    <DesktopNavWrapper>
      <DesktopGuestNav />
      <DesktopUserNav />
      <DesktopAdminNav />
      <DesktopOpsNav />
      <DesktopRetailNav />
    </DesktopNavWrapper>
  );
}

export default DesktopNav;
