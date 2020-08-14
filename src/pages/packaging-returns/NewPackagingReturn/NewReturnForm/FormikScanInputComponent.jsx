/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  List,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

import SelectOneDialog from './OnMissingOptions.dialog';
import ScannerQR from 'common/ScannerQR';

// CSS
import styled from 'styled-components';
import styles from './index.module.css';

export default function ScanInputContainer({
  remove,
  unshift,
  form: {
    values: { packaging_urls },
    isSubmitting,
  },
}) {
  const [showOptionsOnMissing, setShowOptionsOnMissing] = useState(false);

  const handleClose = (v) => {
    setShowOptionsOnMissing(false);
    if (v) {
      unshift(v);
    }
  };

  const handleMissingQRCode = () => {
    setShowOptionsOnMissing(true);
  };

  const handleScanCompletion = (urls) => {
    urls.forEach((url) => unshift(url));
  };

  return (
    <>
      <Grid item xs={12} className={styles.pseudoInputContainer}>
        {!packaging_urls.length && (
          <Typography variant={'subtitle1'} color={'textSecondary'}>
            Start scanning ...
          </Typography>
        )}
        <List dense>
          {packaging_urls.map((url, index) => (
            <ListItem key={index}>
              <ListItemText>
                <Typography className={styles.url} variant="body2">
                  {url}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction onClick={() => remove(index)}>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Box p={2} justifyContent={'center'} display={'flex'}>
        <Button
          color="secondary"
          type="submit"
          fullWidth
          size={'large'}
          variant={'contained'}
          disabled={!packaging_urls.length || isSubmitting}
          style={{ color: '#fff' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
      <Grid
        item
        container
        xs={12}
        justify="center"
        spacing={2}
        alignItems="center"
      >
        <SelectOneDialog open={showOptionsOnMissing} onClose={handleClose} />
        <Grid container item xs={6} justify="center">
          <MissingQR onClick={handleMissingQRCode} />
        </Grid>
        <Grid container item xs={6} justify="center">
          <ScanQRCode onScanCompletion={handleScanCompletion} />
        </Grid>
      </Grid>
    </>
  );
}

const ReturnFormButton = styled(Button)`
  padding: 1.75rem 1.3rem;
  margin: 0.2rem;
`;

const MissingQRButton = styled(ReturnFormButton)`
  color: #ba3b46;
`;

const ScanQRButton = styled(ReturnFormButton)`
  color: #fff;
`;

function MissingQR({ onClick }) {
  return (
    <MissingQRButton
      variant="outlined"
      size="large"
      onClick={onClick}
      fullWidth={true}
      type={'button'}
    >
      <Typography variant="body1">Missing QR</Typography>
    </MissingQRButton>
  );
}

function makeURLFromId(id) {
  return `https://thewallyshop.co/packaging/${id}`;
}

function ScanQRCode({ onScanCompletion }) {
  const [qrOpened, setQrOpened] = useState(false);

  const handleQROpen = useCallback(() => {
    setQrOpened(true);
  }, []);

  const handleQRScan = useCallback((packaging_ids = []) => {
    if (packaging_ids) {
      const urls = packaging_ids.map((id) => makeURLFromId(id));
      onScanCompletion(urls);
    }
    setQrOpened(false);
  });

  return (
    <Grid item xs={12}>
      <ScanQRButton
        onClick={handleQROpen}
        variant="contained"
        fullWidth={true}
        color={'primary'}
        type="button"
      >
        <Typography variant="body1">Scan QR</Typography>
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

ScanQRCode.propTypes = {
  onScanCompletion: PropTypes.func.isRequired,
};
