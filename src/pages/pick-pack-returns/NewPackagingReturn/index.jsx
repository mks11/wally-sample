import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, Divider, Dialog, Grid } from "@material-ui/core";
import { connect } from "utils";
import JarOrLidDialog from "./JarOrLidOptionsDialog";
import NewReturnForm from "./NewReturnForm";

function ScanQRCode({ show, onComplete }) {
  return <div></div>;
}

function NewPackagingReturn({
  store: { user: userStore, packagingReturn, modal },
}) {
  const [showJarOrLidOpen, setShowJarOrLidOpen] = useState(false);
  const [showQRCodePage, setShowQRCodePage] = useState(false);

  const user_id = userStore.user && userStore.user._id;

  const handleClose = (selectedValue) => {
    setShowJarOrLidOpen(false);
    if (!!selectedValue) {
      packagingReturn.addPackagingURL(selectedValue);
    }
  };

  const handleScanCompletion = (url) => {
    if (url) {
      packagingReturn.addPackagingURL(url);
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
    <Container
      style={{
        // flex: 1,
        flexDirection: "column",
        // border: "1px solid bldddue",
        // height: "80vh",
        display: "flex",
        // justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: "2rem",
      }}
      maxWidth="sm"
    >
      <h2 className={{ textAlign: "center" }}>New Packaging Return </h2>
      <NewReturnForm
        packagingURLs={packagingReturn.packaging_urls.toJS().reverse()}
        user_id={user_id}
      />
      <Divider />
      <Grid
        container
        style={{ border: "1px solid pink" }}
        // alignContent={"stretch"}
        justify="center"
      >
        <JarOrLidDialog open={showJarOrLidOpen} onClose={handleClose} />
        <Grid container item xs={6} justify="center">
          <Button
            color="secondary"
            variant="outlined"
            size="large"
            onClick={handleMissingQRCode}
            style={{ padding: "1.75rem 1.3rem", margin: "0.2rem" }}
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
            style={{ padding: "1.75rem 1.5rem", margin: "0.2rem" }}
          >
            Scan QR Code
          </Button>
        </Grid>
        <ScanQRCode show={showQRCodePage} onComplete={handleScanCompletion} />
      </Grid>
    </Container>
  );
}

NewPackagingReturn.propTypes = {};

// mobx v5 work around for hooks
class _NewPackagingReturn extends React.Component {
  render() {
    return <NewPackagingReturn {...this.props} />;
  }
}

export default connect("store")(_NewPackagingReturn);
