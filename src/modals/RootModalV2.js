import React from 'react';

// Material ui
import { Box, Button, Container, Drawer } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

function RootModalV2() {
  const { modalV2 } = useStores();
  const { anchor, children, isOpen } = modalV2;

  const handleClose = () => {
    modalV2.close();
  };

  return (
    <Drawer
      anchor={anchor || 'right'}
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
          width: '100%',
          maxWidth: '576px',
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
