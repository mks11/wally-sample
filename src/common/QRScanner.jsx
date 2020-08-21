import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QrReader from 'react-qr-reader';
import LazyLoad from 'react-lazyload';
import {
  Container,
  Drawer,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Close } from '@material-ui/icons';
import styled from 'styled-components';

const ScannerContainer = styled(Container)`
  height: 100vh;
`;

const Scanner = styled(Paper)`
  @media only screen and (max-width: 767px) {
    z-index: 1;
    position: relative;
    width: 80vw;
    height: 80vw;
  }

  @media only screen and (orientation: 'landscape') {
    z-index: 1;
    position: relative;
    width: 40vw;
    height: 40vw;
  }

  @media only screen and (min-width: 768px) {
    z-index: -1;
    width: 40vw;
    height: 40vw;
  }
`;

export default function QRScanner({
  isOpen,
  closeScanner,
  onScan,
  onError,
  scanMultipleQrs,
  progressText,
  cameraDirection = 'environment',
}) {
  const [hasFinishedScanning, setHasFinishedScanning] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [encounteredError, setEncounteredError] = useState(false);

  const openSnackbar = (text) => {
    setSnackbarMessage(text);
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarMessage('');
    setIsSnackbarOpen(false);
  };

  const handleScan = (qr) => {
    const QR_REGEX = /https:\/\/thewallyshop\.co\/packaging\/(.*)/;
    if (qr) {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(500);
      }

      const [url, packagingId] = qr.match(QR_REGEX);

      if (!url) {
        setEncounteredError(true);
        openSnackbar("The code you scanned doesn't belong to The Wally Shop");
      }

      if (packagingId && !hasFinishedScanning) {
        onScan(url);
        // Reset error state
        setEncounteredError(false);
        openSnackbar(`Code ${packagingId} scanned successfully!`);
        if (!scanMultipleQrs) {
          setHasFinishedScanning(true);
          setTimeout(() => {
            closeScanner();
          }, 2000);
        }
      }
    }
  };

  const handleError = (err) => {
    setEncounteredError(true);
    openSnackbar('Oops, an error occured while scanning 😅');
    onError && onError(err);
  };

  return (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={closeScanner}
      ModalProps={{
        BackdropProps: { style: { backgroundColor: 'rgba(0, 0, 0, 0.85)' } },
      }}
      PaperProps={{
        style: {
          height: '100vh',
          width: '100vw',
          backgroundColor: 'transparent',
        },
      }}
    >
      <ScannerContainer maxWidth="sm">
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          style={{ padding: '2rem 1rem', fontSize: '3rem' }}
        >
          <Close
            fontSize="inherit"
            onClick={closeScanner}
            style={{ color: '#fff' }}
          />
        </Grid>
        <Grid container justify="center" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              component="p"
              align="center"
              style={{ color: '#fff' }}
            >
              {progressText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Scanner>
                <LazyLoad>
                  <QrReader
                    onScan={handleScan}
                    onError={handleError}
                    facingMode
                  />
                </LazyLoad>
              </Scanner>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ScanStatusBar
              isOpen={isSnackbarOpen}
              closeSnackbar={closeSnackbar}
              message={snackbarMessage}
              encounteredError={encounteredError}
            />
          </Grid>
        </Grid>
      </ScannerContainer>
    </Drawer>
  );
}

QRScanner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function ScanStatusBar({ closeSnackbar, isOpen, message, encounteredError }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={2000}
      onClose={closeSnackbar}
      open={isOpen}
    >
      <Alert severity={encounteredError ? 'error' : 'success'}>{message}</Alert>
    </Snackbar>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
