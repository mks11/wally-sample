import React, { useState, useCallback } from "react";
import { Button, Grid } from "@material-ui/core";
import styles from "./bigButton.module.css";
import ScannerQR from "common/ScannerQR";

function makeURLFromId(id) {
  return `https://thewallyshop.co/packaging/${id}`;
}

export default function ScanQRCode({ returnStore }) {
  const [qrOpened, setQrOpened] = useState(false);
  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const handleScanCompletion = (packaging_ids = []) => {
    packaging_ids.forEach((id) => {
      const url = makeURLFromId(id);
      returnStore.addPackagingURL(url);
    });
    setQrOpened(false);
  };

  return (
    <Grid item xs={12}>
      <Button
        className={styles.bigButton}
        onClick={handleQROpen}
        variant="contained"
        fullWidth={true}
        color={"primary"}
      >
        Scan QR Code
      </Button>
      <ScannerQR
        isOpen={qrOpened}
        onClose={handleScanCompletion}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Grid>
  );
}
