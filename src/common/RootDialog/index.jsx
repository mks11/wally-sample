import React from 'react';

// Material ui
import { Box, Button, Dialog, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';
import { Suspense } from 'react';

function RootDialog() {
  const { dialog: dialogStore } = useStores();
  const { isOpen, content } = dialogStore;

  const handleClose = () => {
    dialogStore.close();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="xl">
      {/** minHeight is set for the loader to show nicely */}
      <Box p={2} minHeight={240}>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={handleClose}>
            <CloseIcon fontSize="large" />
          </Button>
        </Box>
        <Suspense fallback={SuspenseFallback()}>{content}</Suspense>
      </Box>
    </Dialog>
  );
}

export default observer(RootDialog);

function SuspenseFallback() {
  return (
    <Box m={2}>
      <Typography variant="h6"> Loading ...</Typography>
    </Box>
  );
}
