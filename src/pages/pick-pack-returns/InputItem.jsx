
import React, { useState, useCallback } from 'react'

// Components
import {
  Paper,
  Button,
  Grid,
} from '@material-ui/core';

import ScannerQR from 'common/ScannerQR';
import ScannerBarcode from 'common/ScannerBarcode'

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputCustomerJar({ index, onScan, value }) {
  const [qrOpened, setQrOpened] = useState(false);

  const handleQRScan = useCallback((v) => {
    if (v) {
      // formik setFieldValue method
      onScan(`packaging_urls.${index}`, v)
    }
    setQrOpened(false)
  }, [])

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, [])

  const disabled = value.includes('thewallyshop.co/packaging');

  return (
    <Grid item xs="12" className={styles.jarInput}>
      Jar {index + 1}
      <Button
        className={disabled ? styles.jarInputButtonScanned : styles.jarInputButton}
        onClick={handleQROpen}
        variant="contained"
        disabled={disabled}
      >
        {disabled ? 'QR Scanned' : 'Scan QR Code'}
      </Button>

      <ScannerQR
        isOpen={qrOpened}
        onClose={handleQRScan}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Grid>
  )
}

function InputItem({ field, ...props }) {
  const [barscanOpened, setBarscanOpened] = useState(false);
  const [barscanError, setBarscanError] = useState(false);

  const handleBarcodeScan = useCallback((value) => {
    if (value) {
      setBarscanError(false)
      if (value === field.value.upc_code) {
        // formik setFieldValue method
        props.onScan(`field.name.was_upc_verified`, true)
      } else {
        setBarscanError(true)
      }
    }
    setBarscanOpened(false)
  }, [])

  const handleToggleBarscan = useCallback(() => {
    setBarscanOpened(!barscanOpened);
  }, [barscanOpened])

  return (
    <Paper className={styles.itemBlock}>
      <Grid container justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item component="h3">
          {field.value.name}
          <br />
          <span className={styles.itemBlockLocation}>
            row: {field.value.warehouse_location.row || '-'} shelf: {field.value.warehouse_location.shelf || '-'}
          </span>
        </Grid>
        <Grid item>
          <Button
            onClick={handleToggleBarscan}
            variant="contained"
          >
            Scan UPC
          </Button>
        </Grid>
      </Grid>
      {barscanError ? (
        <div className="text-center text-error">Bar code didn't match</div>
      ) : null}
      <Grid container justify="space-evenly" alignItems="center">
        {[...new Array(field.value.customer_quantity)].map((_, idx) => (
          <InputCustomerJar
            index={idx}
            onScan={props.onScan}
            value={field.value.packaging_urls[idx]}
          />
        ))}
      </Grid>

      <ScannerBarcode
        isOpen={barscanOpened}
        onClose={handleToggleBarscan}
        onDetect={handleBarcodeScan}
        messageSuccess="Barcode Scanned"
        messageError="Barcode Scan Error"
        closeOnScan
      />
    </Paper>
  );
}

export default InputItem
