import React, { useState, useCallback } from 'react';

// Components
import { Paper, Grid, Typography } from '@material-ui/core';
import { ScanQRButton, ResetButton } from './PickPackComponents';

import QRScanner from 'common/QRScanner';
// import ScannerBarcode from 'common/ScannerBarcode';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function InputItem({ field, ...props }) {
  const {
    customer_quantity,
    name,
    packaging_urls,
    warehouse_location,
    sku_id,
  } = field.value;

  // UPC State Management
  // TODO
  // const [barscanOpened, setBarscanOpened] = useState(false);
  // const [barscanError, setBarscanError] = useState(false);

  // const handleBarcodeScan = useCallback((value) => {
  //   if (value) {
  //     setBarscanError(false);
  //     if (value === field.value.upc_code) {
  //       // formik setFieldValue method
  //       props.onScan(`field.name.was_upc_verified`, true);
  //     } else {
  //       setBarscanError(true);
  //     }
  //   }
  //   setBarscanOpened(false);
  // }, []);

  // const handleToggleBarscan = useCallback(() => {
  //   setBarscanOpened(!barscanOpened);
  // }, [barscanOpened]);

  // QR state management
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrScanProgress, setQrScanProgress] = useState(packaging_urls.length);

  const openQRScanner = () => {
    setIsQRScannerOpen(true);
  };

  const closeQRScanner = () => {
    setIsQRScannerOpen(false);
  };

  const isScanningComplete = () => {
    return packaging_urls.length === customer_quantity;
  };

  const handleQRScan = (qrCode) => {
    if (
      qrCode &&
      qrCode.includes('thewallyshop.co/packaging') &&
      !packaging_urls.includes(qrCode) &&
      !isScanningComplete()
    ) {
      packaging_urls.push(qrCode);
      setQrScanProgress(qrScanProgress + 1);
    }

    if (isScanningComplete()) {
      setTimeout(() => {
        closeQRScanner();
      }, 2000);
    }
  };

  const resetQRScan = () => {
    props.form.setFieldValue(field.name, {
      ...field.value,
      packaging_urls: [],
    });
    setQrScanProgress(0);
  };

  let packagingType = name.match(/ - [\d]+ oz Wally Jar/).pop();
  const productName = name.replace(packagingType, '');

  return (
    <Paper className={styles.itemBlock}>
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2">
            {productName}
          </Typography>
          <Typography variant="body1" component="p">
            {packaging_urls.length}/{customer_quantity} jars scanned
          </Typography>
          <Typography variant="subtitle1">
            {packagingType.replace(' - ', '')}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ display: 'inline', marginRight: '0.5rem' }}
          >
            Row: {warehouse_location?.row || 'N/A'}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ display: 'inline', marginRight: '0.5rem' }}
          >
            Shelf: {warehouse_location?.shelf || 'N/A'}
          </Typography>
        </Grid>
        {/* <Grid item>
          <ScanUPCButton onClick={handleToggleBarscan} variant="contained">
            <Typography variant="body1">Scan UPC</Typography>
          </ScanUPCButton>
        </Grid> */}
      </Grid>
      {/* {barscanError ? (
        <div className="text-center text-error">Bar code didn't match</div>
      ) : null} */}
      <br />
      <br />
      <Grid item xs={12}>
        <Grid container justify="space-evenly">
          <ResetButton onClick={resetQRScan}>
            <Typography variant="body1">Reset</Typography>
          </ResetButton>
          <ScanQRButton
            onClick={openQRScanner}
            variant="contained"
            disabled={isScanningComplete()}
          >
            <Typography variant="body1">Scan</Typography>
          </ScanQRButton>
          <QRScanner
            isOpen={isQRScannerOpen}
            onClose={closeQRScanner}
            onScan={handleQRScan}
            onError={() => props.modalStore.toggleModal('error')}
            progressText={`${productName} - ${qrScanProgress}/${customer_quantity}`}
            expectedSku={sku_id}
            cameraDirection="user"
          />
        </Grid>
      </Grid>

      {/* <ScannerBarcode
        dataId={null} // new parameter to handle specific input
        isOpen={barscanOpened}
        onClose={handleToggleBarscan}
        onDetect={handleBarcodeScan}
        messageSuccess="Barcode Scanned"
        messageError="Barcode Scan Error"
        closeOnScan
      /> */}
    </Paper>
  );
}

export default InputItem;
