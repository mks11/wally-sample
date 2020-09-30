import React, { useState } from 'react';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Material UI
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { FaRegUserCircle } from 'react-icons/fa';

// Custom Components
import { DesktopUserNav } from './UserNav';

function DesktopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useStores();
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Box position="relative">
      <IconButton aria-label="account" disableRipple onClick={openMenu}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <FaRegUserCircle />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" component="span">
                {user.name}
              </Typography>
              <ArrowDropDownIcon />
            </Box>
          </Grid>
        </Grid>
      </IconButton>
      <Menu open={isMenuOpen} onClose={closeMenu}>
        <DesktopUserNav />
      </Menu>
    </Box>
  );
}

export default observer(DesktopNav);
