import React from 'react';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Material UI
import { Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function RootSnackbar() {
  const { store } = useStores();
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={store.snackbar.isOpen}
      autoHideDuration={6000}
      onClose={store.snackbar.closeSnackbar}
    >
      <Alert
        onClose={store.snackbar.closeSnackbar}
        severity={store.snackbar.severity}
      >
        <Typography variant="body1">{store.snackbar.message}</Typography>
      </Alert>
    </Snackbar>
  );
}

export default observer(RootSnackbar);
