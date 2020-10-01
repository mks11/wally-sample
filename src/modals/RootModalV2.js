import React from 'react';

// Node Modlues
import { isMobile } from 'react-device-detect';

// Material ui
import { Box, Button, Container, Drawer, Grid } from '@material-ui/core';
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
          top: 'unset',
          right: 'unset',
          left: 'unset',
          bottom: 'unset',
        },
      }}
    >
      <Box p={4}>
        <Container maxWidth="sm" disableGutters>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button onClick={handleClose}>
              <CloseIcon fontSize="large" />
            </Button>
          </Box>
          {children}
        </Container>
      </Box>
    </Drawer>
  );
}

export default observer(RootModalV2);
