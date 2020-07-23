import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Snackbar, CircularProgress, Grid, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";

export default function Get({
  title,
  loadTitle,
  children,
  onSuccessMsg,
  onErrorMsg,
  onCompletion,
  url,
  axiosReqConfig,
  autoHideDuration = 3000,
}) {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const makeRequest = async (URL) => {
    const response = await axios.get(URL, axiosReqConfig);
    return response;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await makeRequest(url);
      onCompletion(response);
    } catch (e) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!onSuccessMsg) {
      setShowSuccess(true);
    }
  }, [onSuccessMsg]);

  return (
    <Fragment>
      <Snackbar
        open={showSuccess}
        autoHideDuration={autoHideDuration}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">{onSuccessMsg}</Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={autoHideDuration + 1000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error">{onErrorMsg}</Alert>
      </Snackbar>
      <Grid container justify="center">
        <Button
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? loadTitle : title}
        </Button>
      </Grid>
      {children}
    </Fragment>
  );
}
