import React, { Fragment, useState, useEffect } from 'react';
import { Observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Snackbar, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { SecondaryWallyButton } from 'styled-component-lib/Buttons';
export default function FetchButton({
  title,
  loadTitle,
  onSuccessMsg,
  onErrorMsg,
  onCompletion,
  url,
  autoHideDuration = 3000,
  userStore,
  loadingStore,
}) {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadingTitle = loadTitle || title;

  const runReturnsJob = async (URL) => {
    return axios.get(URL, userStore.getHeaderAuth());
  };

  const handleSubmit = async () => {
    setLoading(true);
    loadingStore.toggle();
    runReturnsJob(url)
      .then((res) => {
        onCompletion(res);
      })
      .catch((err) => {
        setShowError(true);
      })
      .finally(() => {
        setLoading(false);
        loadingStore.toggle();
      });
  };

  useEffect(() => {
    userStore.getStatus();
    if (onSuccessMsg) {
      setShowSuccess(true);
    }
  }, [onSuccessMsg]);

  return (
    <Observer>
      {() => (
        <Fragment>
          <Snackbar
            open={showSuccess}
            autoHideDuration={autoHideDuration}
            onClose={() => setShowSuccess(false)}
          >
            <Alert severity="success" onClose={() => setShowSuccess(false)}>
              {onSuccessMsg}
            </Alert>
          </Snackbar>
          <Snackbar
            open={showError}
            autoHideDuration={autoHideDuration + 1000}
            onClose={() => setShowError(false)}
          >
            <Alert severity="error" onClose={() => setShowError(false)}>
              {onErrorMsg}
            </Alert>
          </Snackbar>
          <Grid container justify="center">
            <SecondaryWallyButton
              disabled={loading}
              onClick={handleSubmit}
              fullWidth
              size="large"
            >
              <Typography variant="body1">
                {loading ? loadingTitle : title}
              </Typography>
            </SecondaryWallyButton>
          </Grid>
        </Fragment>
      )}
    </Observer>
  );
}

FetchButton.propTypes = {
  title: PropTypes.string.isRequired,
  loadTitle: PropTypes.string,
  onSuccessMsg: PropTypes.string,
  onErrorMsg: PropTypes.string,
  onCompletion: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  userStore: PropTypes.object.isRequired,
  autoHideDuration: PropTypes.number.isRequired,
};
