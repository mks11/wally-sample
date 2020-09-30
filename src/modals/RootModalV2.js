import React from 'react';

// Node Modlues
import { isMobile } from 'react-device-detect';

// Material ui
import { Box, Button, Drawer, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

function RootModalV2() {
  const { modalV2 } = useStores();
  const { isOpen, children } = modalV2;

  const handleClose = () => {
    modalV2.close();
  };

  return (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={handleClose}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      PaperProps={{
        square: false,
        style: {
          minWidth: isMobile ? '100%' : '450px',
          top: 'unset',
          right: 'unset',
          left: 'unset',
          bottom: 'unset',
        },
      }}
    >
      <Box px={4} py={2}>
        <Grid container justify="flex-end">
          <Button onClick={handleClose}>
            <CloseIcon fontSize="large" />
          </Button>
        </Grid>
        {children}
      </Box>
    </Drawer>
  );
}

export default observer(RootModalV2);
