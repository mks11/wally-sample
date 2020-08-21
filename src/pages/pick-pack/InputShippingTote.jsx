import React, { useState, useCallback } from 'react';

// Components
import { Paper, Grid, Typography } from '@material-ui/core';
import { ScanQRButton, ResetButton } from './PickPackComponents';

import QRScanner from 'common/QRScanner';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputShippingTote({ field, ...props }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const handleQRScan = (qrCode) => {
    if (qrCode && qrCode.includes('thewallyshop.co/packaging')) {
      // formik setFieldValue method
      props.onScan(field.name, qrCode);
      setScanProgress(scanProgress + 1);
      setTimeout(() => {
        closeScanner();
      }, 2000);
    }
  };

  const resetQRScan = () => {
    props.form.setFieldValue(field.name, '');
    setScanProgress(0);
  };

  return (
    <Paper className={styles.toteItem}>
      <Grid container justify="center" alignItems="center" spacing={4}>
        <Grid item xs={6}>
          <Typography variant="h4" component="h2">
            Tote {props.fieldIndex + 1}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{scanProgress}/1 Scanned</Typography>
        </Grid>
        <br />
        <Grid item xs={6}>
          <ResetButton onClick={resetQRScan}>
            <Typography variant="body1">Reset</Typography>
          </ResetButton>
        </Grid>
        <Grid item xs={6}>
          <ScanQRButton
            onClick={openScanner}
            disabled={scanProgress}
            variant="contained"
          >
            <Typography variant="body1">
              {scanProgress ? 'Scanned' : 'Scan'}
            </Typography>
          </ScanQRButton>
        </Grid>
      </Grid>
      <QRScanner
        isOpen={isScannerOpen}
        onClose={closeScanner}
        onScan={handleQRScan}
        progressText={`Tote ${
          props.fieldIndex + 1
        } - ${scanProgress}/1 Scanned`}
      />
    </Paper>
  );
}

export default InputShippingTote;
