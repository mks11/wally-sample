import React from 'react';

// Material ui
import { Box, Button, Container, Drawer } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

function RootModalV2() {
  const theme = useTheme();
  const { modalV2, product } = useStores();
  const { anchor, children, isOpen, maxWidth, paperStyle } = modalV2;

  const handleClose = () => {
    product.resetActiveProduct();
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
        style: paperStyle
          ? paperStyle
          : {
              width: '100%',
              maxWidth: maxWidth ? getBreakpointWidth(maxWidth) : '576px',
            },
      }}
    >
      <Box p={4}>
        <Container maxWidth={maxWidth} disableGutters>
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

  function getBreakpointWidth(width) {
    if (!['xs', 'sm', 'md', 'lg', 'xl'].includes(width)) return;

    return theme.breakpoints.values[width].toString() + 'px';
  }
}

export default observer(RootModalV2);
