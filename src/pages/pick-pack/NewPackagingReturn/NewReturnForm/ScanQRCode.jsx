import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Grid } from "@material-ui/core";
import styles from "./bigButton.module.css";
import ScannerQR from "common/ScannerQR";

function makeURLFromId(id) {
  return `https://thewallyshop.co/packaging/${id}`;
}

export default function ScanQRCode({ onScanCompletion }) {
  const [qrOpened, setQrOpened] = useState(false);
  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const handleScanCompletion = (packaging_ids = []) => {
    const urls = packaging_ids.map((id) => makeURLFromId(id));
    onScanCompletion(urls);
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
        type="button"
      >
        Scan QR Code
      </Button>
      <ScannerQR isOpen={qrOpened} onClose={handleScanCompletion} />
    </Grid>
  );
}

ScanQRCode.propTypes = {
  onScanCompletion: PropTypes.func.isRequired,
};
