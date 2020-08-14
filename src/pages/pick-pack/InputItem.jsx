import React, { useState, useCallback } from 'react';

// Components
import { Paper, Button, Grid, Typography } from '@material-ui/core';
import { ScanQRButton, ScanUPCButton } from './PickPackComponents';

import ScannerQR from 'common/ScannerQR';
import ScannerBarcode from 'common/ScannerBarcode';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputCustomerJar({ index, onScan, value }) {
  const [qrOpened, setQrOpened] = useState(false);

  const handleQRScan = useCallback((v) => {
    if (v) {
      // formik setFieldValue method
      onScan(`packaging_urls.${index}`, v);
    }
    setQrOpened(false);
  }, []);

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const disabled = value && value.includes('thewallyshop.co/packaging');

  return (
    <Grid item xs={12}>
      <ScanQRButton
        onClick={handleQROpen}
        variant="contained"
        disabled={disabled}
      >
        <Typography variant="body1">
          {disabled ? `Jar ${index + 1} Scanned` : `Scan Jar ${index + 1}`}
        </Typography>
      </ScanQRButton>
      <ScannerQR
        dataId={null} // new parameter to handle specific input
        isOpen={qrOpened}
        onClose={handleQRScan}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Grid>
  );
}

function InputItem({ field, ...props }) {
  const [barscanOpened, setBarscanOpened] = useState(false);
  const [barscanError, setBarscanError] = useState(false);

  const handleBarcodeScan = useCallback((value) => {
    if (value) {
      setBarscanError(false);
      if (value === field.value.upc_code) {
        // formik setFieldValue method
        props.onScan(`field.name.was_upc_verified`, true);
      } else {
        setBarscanError(true);
      }
    }
    setBarscanOpened(false);
  }, []);

  const handleToggleBarscan = useCallback(() => {
    setBarscanOpened(!barscanOpened);
  }, [barscanOpened]);
  let packagingType = field.value.name.match(/ - [\d]+ oz Wally Jar/).pop();
  const productName = field.value.name.replace(packagingType, '');

  return (
    <Paper className={styles.itemBlock}>
      <Grid container justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item>
          <Typography variant="body1">{productName}</Typography>
          <Typography variant="subtitle1">
            {packagingType.replace(' - ', '')}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ display: 'inline', marginRight: '0.5rem' }}
          >
            Row: {field.value.warehouse_location?.row || 'N/A'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ display: 'inline', marginRight: '0.5rem' }}
          >
            Shelf: {field.value.warehouse_location?.shelf || 'N/A'}
          </Typography>
        </Grid>
        <Grid item>
          <ScanUPCButton onClick={handleToggleBarscan} variant="contained">
            <Typography variant="body1">Scan UPC</Typography>
          </ScanUPCButton>
        </Grid>
      </Grid>
      {barscanError ? (
        <div className="text-center text-error">Bar code didn't match</div>
      ) : null}
      <br />
      <Grid container direction="column" alignItems={'flex-end'} spacing={4}>
        {[...new Array(field.value.customer_quantity)].map((_, idx) => (
          <InputCustomerJar
            key={idx}
            index={idx}
            onScan={props.onScan}
            value={field.value.packaging_urls[idx]}
          />
        ))}
      </Grid>

      <ScannerBarcode
        dataId={null} // new parameter to handle specific input
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

export default InputItem;
