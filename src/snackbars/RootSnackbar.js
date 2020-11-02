import React from 'react';

// mobx
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Material UI
import { Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function RootSnackbar() {
  const { snackbar } = useStores();
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={snackbar.isOpen}
      autoHideDuration={6000}
      onClose={snackbar.closeSnackbar}
    >
      <Alert onClose={snackbar.closeSnackbar} severity={snackbar.severity}>
        <Typography variant="body1">{snackbar.message}</Typography>
      </Alert>
    </Snackbar>
  );
}

export default observer(RootSnackbar);
