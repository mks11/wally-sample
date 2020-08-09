import React, { useState, useCallback } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { connect } from "utils";
import SelectOneDialog from "./OnMissingOptions.dialog";
import NewReturnForm from "./NewReturnForm";
import Page from "../shared/Tab";
import styles from "./index.module.css";
import { useFormikContext } from "formik";
import ScannerQR from "common/ScannerQR";

function makeURLFromId(id) {
  return `https://thewallyshop.co/packaging/${id}`;
}

function ScanQRCode({ returnStore }) {
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
        className={styles.bigActionButton}
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
function NewPackagingReturn({
  store: { user: userStore, packagingReturn: returnStore },
}) {
  const [showOptionsOnMissing, setShowOptionsOnMissing] = useState(false);

  const user_id = userStore.user && userStore.user._id;
  const { token = {} } = userStore;

  const handleClose = (selectedValue) => {
    setShowOptionsOnMissing(false);
    if (selectedValue) {
      returnStore.addPackagingURL(selectedValue);
    }
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
      <Grid container justify="center" spacing={2}>
        <SelectOneDialog open={showOptionsOnMissing} onClose={handleClose} />
        <Grid container item xs={6} justify="center">
          <Button
            color="secondary"
            variant="outlined"
            size="large"
            onClick={handleMissingQRCode}
            className={styles.bigActionButton}
            fullWidth={true}
          >
            Missing QR Code
          </Button>
        </Grid>
        <Grid container item xs={6} justify="center">
          <ScanQRCode returnStore={returnStore} />
        </Grid>
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
