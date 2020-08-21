import React, { useState, useCallback } from 'react';

// Components
import { Paper, Grid, Typography } from '@material-ui/core';
import { ScanQRButton } from './PickPackComponents';

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

  const handleQRScan = (value) => {
    if (value) {
      // formik setFieldValue method
      props.onScan(field.name, value);
      setScanProgress(scanProgress + 1);
    }
  };

  const disabled = field.value.includes('thewallyshop.co/packaging');

  return (
    <Paper className={styles.toteItem}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body1">Tote {props.fieldIndex + 1}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {scanProgress}/1 Scanned
          </Typography>
        </Grid>
        <Grid item>
          <ScanQRButton
            onClick={openScanner}
            disabled={disabled}
            variant="contained"
          >
            <Typography variant="body1">
              {disabled ? 'Scanned' : 'Scan'}
            </Typography>
          </ScanQRButton>
        </Grid>
      </Grid>
      <QRScanner
        isOpen={isScannerOpen}
        closeScanner={closeScanner}
        onScan={handleQRScan}
        progressText={`Tote ${
          props.fieldIndex + 1
        } - ${scanProgress}/1 Scanned`}
      />
    </Paper>
  );
}

export default InputShippingTote;
