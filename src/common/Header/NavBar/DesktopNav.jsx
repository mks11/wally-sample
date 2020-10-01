import React from 'react';

// mobx
import { observer } from 'mobx-react';

// Material UI
import { Box } from '@material-ui/core';

// Custom Components
import { DesktopUserNav } from './UserNav';

function DesktopNav() {
  return <DesktopUserNav />;
}

export default observer(DesktopNav);
