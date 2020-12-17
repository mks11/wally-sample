import React, { useState } from 'react';

// Material ui
import { Box, Container, Grid, IconButton } from '@material-ui/core';
import { CloseIcon } from 'Icons';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

function Banner({ children }) {
  const [show, setShow] = useState(true);
  const { user: userStore } = useStores();
  const { isLoggedIn, isUser } = userStore;

  const handleClick = () => {
    setShow(false);
  };

  return show && (!isLoggedIn || isUser) ? (
    <Box py={2} style={{ backgroundColor: '#97adff' }}>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={11}>
            {children}
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              <IconButton onClick={handleClick}>
                <CloseIcon style={{ color: '#fff' }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  ) : null;
}

export default observer(Banner);
