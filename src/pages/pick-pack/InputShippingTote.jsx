import React, { useState, useCallback } from 'react';

// Components
import { Paper, Grid, Typography } from '@material-ui/core';
import { ScanQRButton, ResetButton } from './PickPackComponents';

import QRScanner from 'common/QRScanner';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputShippingTote({ field, ...props }) {
  const [scanProgress, setScanProgress] = useState(field.value ? 1 : 0);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const handleQRScan = (qrCode) => {
    if (
      qrCode &&
      qrCode.includes('thewallyshop.co/packaging') &&
      scanProgress == 0
    ) {
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
        <Grid item xs={12}>
          <Typography variant="h4" component="h2">
            Tote {props.fieldIndex + 1}
          </Typography>
          <Typography variant="body1">{scanProgress}/1 Scanned</Typography>
        </Grid>
        <br />
        <Grid item xs={12}>
          <Grid container justify="space-evenly">
            <ResetButton onClick={resetQRScan}>
              <Typography variant="body1">Reset</Typography>
            </ResetButton>
            <ScanQRButton
              onClick={openScanner}
              disabled={scanProgress ? true : false}
              variant="contained"
            >
              <Typography variant="body1">
                {scanProgress ? 'Scanned' : 'Scan'}
              </Typography>
            </ScanQRButton>
          </Grid>
        </Grid>
      </Grid>
      <QRScanner
        isOpen={isScannerOpen}
        onClose={closeScanner}
        onScan={handleQRScan}
        onError={() => props.modalStore.toggleModal('error')}
        progressText={`Tote ${
          props.fieldIndex + 1
        } - ${scanProgress}/1 Scanned`}
      />
    </Paper>
  );
}

export default InputShippingTote;
