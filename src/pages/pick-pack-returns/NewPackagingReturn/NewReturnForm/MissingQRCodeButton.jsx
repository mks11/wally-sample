import React from "react";
import { Button } from "@material-ui/core";
import styles from "./bigButton.module.css";

export default function MissingQRCodeButton({ onClick }) {
  return (
    <Button
      color="secondary"
      variant="outlined"
      size="large"
      onClick={onClick}
      className={styles.bigButton}
      fullWidth={true}
    >
      Missing QR Code
    </Button>
  );
}
