import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { connect } from "utils";
import JarOrLidDialog from "./JarOrLidOptionsDialog";
import NewReturnForm from "./NewReturnForm";
import Page from "../shared/Page";
import styles from "./index.module.css";

function ScanQRCode({ show, onComplete }) {
  //TODO
  return <div></div>;
}

function NewPackagingReturn({
  store: { user: userStore, packagingReturn: returnStore },
}) {
  const [showJarOrLidOpen, setShowJarOrLidOpen] = useState(false);
  const [showQRCodePage, setShowQRCodePage] = useState(false);

  const user_id = userStore.user && userStore.user._id;

  const handleClose = (selectedValue) => {
    setShowJarOrLidOpen(false);
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
    setShowJarOrLidOpen(true);
  };

  const handleClickScanQR = () => {
    setShowQRCodePage(true);
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
        <JarOrLidDialog open={showJarOrLidOpen} onClose={handleClose} />
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
        <Grid container item xs={6} justify="center">
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleClickScanQR}
            className={styles.bigActionButton}
          >
            Scan QR Code
          </Button>
        </Grid>
        <ScanQRCode show={showQRCodePage} onComplete={handleScanCompletion} />
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
