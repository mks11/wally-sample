import React, { useState, useCallback } from 'react';

// Components
import { Paper, Button, Grid, Typography } from '@material-ui/core';
import { ScanQRButton } from './PickPackComponents';

import ScannerQR from 'common/ScannerQR';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputShippingTote({ field, ...props }) {
  const [qrOpened, setQrOpened] = useState(false);

  const handleQRScan = useCallback((value) => {
    if (value) {
      // formik setFieldValue method
      props.onScan(field.name, value);
    }
    setQrOpened(false);
  }, []);

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const disabled = field.value.includes('thewallyshop.co/packaging');

  return (
    <Paper className={styles.toteItem}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body1">Tote {props.fieldIndex + 1}</Typography>
        </Grid>
        <Grid item>
          <ScanQRButton
            onClick={handleQROpen}
            disabled={disabled}
            variant="contained"
          >
            <Typography variant="body1">
              {disabled ? 'QR Scanned' : 'Scan QR Code'}
            </Typography>
          </ScanQRButton>
        </Grid>
      </Grid>
      <ScannerQR
        dataId={null} // new parameter to handle specific input
        isOpen={qrOpened}
        onClose={handleQRScan}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Paper>
  );
}

export default InputShippingTote;
