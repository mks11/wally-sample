import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { connect } from "utils";
import SelectOneDialog from "./OnMissingOptions.dialog";
import NewReturnForm from "./NewReturnForm";
import Page from "../shared/Tab";
import styles from "./index.module.css";
import { useFormikContext } from "formik";
import QRScanner from "common/ScannerQR";

function ScanQRCode({ value }) {
  const { setFieldValue } = useFormikContext();
  const [qrOpened, setQrOpened] = useState(false);

  const handleQRScan = useCallback((v) => {
    if (v) {
      setFieldValue(`packaging_urls.${index}`, v);
    }
    setQrOpened(false);
  }, []);

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const disabled = value.includes("thewallyshop.co/packaging");

  return (
    <Grid item xs="12">
      <Button
        className={
          disabled ? styles.jarInputButtonScanned : styles.jarInputButton
        }
        onClick={handleQROpen}
        variant="contained"
        disabled={disabled}
      >
        {disabled ? "QR Scanned" : "Scan QR Code"}
      </Button>

      <ScannerQR
        isOpen={qrOpened}
        onClose={handleQRScan}
        messageSuccess="QR Scanned"
        messageError="QR Scan error"
      />
    </Grid>
  );
}
function NewPackagingReturn({
  store: { user: userStore, packagingReturn: returnStore },
}) {
  const [showOptionsOnMissing, setShowOptionsOnMissing] = useState(false);
  const [showQRCodePage, setShowQRCodePage] = useState(false);

  const user_id = userStore.user && userStore.user._id;

  const handleClose = (selectedValue) => {
    setShowOptionsOnMissing(false);
    if (selectedValue) {
      returnStore.addPackagingURL(selectedValue);
    }
  };

  const handleScanCompletion = (url) => {
    if (url) {
      returnStore.addPackagingURL(url);
    }
    setShowQRCodePage(false);
  };

  const handleMissingQRCode = () => {
    setShowOptionsOnMissing(true);
  };

  return (
    <Page
      title="New Packaging Return"
      className={styles.pageContainer}
      maxWidth="sm"
    >
      <NewReturnForm
        packagingURLs={returnStore.packaging_urls.toJS().reverse()}
        user_id={user_id}
      />
      <Grid container justify="center">
        <SelectOneDialog open={showOptionsOnMissing} onClose={handleClose} />
        <Grid container item xs={6} justify="center">
          <Button
            color="secondary"
            variant="outlined"
            size="large"
            onClick={handleMissingQRCode}
            className={styles.bigActionButton}
          >
            Missing QR Code
          </Button>
        </Grid>
        <ScanQRCode />
      </Grid>
    </Page>
  );
}

// mobx v5 work around for hooks
class _NewPackagingReturn extends React.Component {
  render() {
    return <NewPackagingReturn {...this.props} />;
  }
}

export default connect("store")(_NewPackagingReturn);
