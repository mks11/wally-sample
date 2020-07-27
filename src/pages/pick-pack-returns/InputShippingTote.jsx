import React, { useState, useCallback } from 'react'

// Components
import {
  Paper,
  Button,
  Grid,
} from '@material-ui/core';

import ScannerQR from 'common/ScannerQR';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputShippingTote({ field, ...props }) {
  const [qrOpened, setQrOpened] = useState(false);

  const handleQRScan = useCallback((value) => {
    if (value) {
      // formik setFieldValue method
      props.onScan(field.name, value)
    }
    setQrOpened(false)
  }, [])

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, [])

  const disabled = field.value.includes('thewallyshop.co/packaging');

  return (
    <Paper className={styles.toteItem}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item component="h3">
          Tote {props.fieldIndex + 1}
        </Grid>
        <Grid item>
          <Button
            className={disabled ? styles.toteScanDisabled : styles.toteScan}
            onClick={handleQROpen}
            disabled={disabled}
            variant="contained"
          >
            {disabled ? 'QR Scanned' : 'Scan QR Code'}
          </Button>
        </Grid>
      </Grid>
      <ScannerQR
        isOpen={qrOpened}
        onClose={handleQRScan}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Paper>
  );
}

export default InputShippingTote
