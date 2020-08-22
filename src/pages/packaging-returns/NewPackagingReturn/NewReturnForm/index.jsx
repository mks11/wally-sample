import React, { useState } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, Snackbar, FormHelperText } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { API_POST_PACKAGING_RETURNS } from '../../../../config';
import TrackingDialogInput from './TrackingDialogInput';
import { withRouter } from 'react-router-dom';
import FormikScanInputComponent from './FormikScanInputComponent';
import styles from './index.module.css';

function NewReturnForm({ user_id, history, loadingStore, userStore }) {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);

  const openSnackbar = (message, severity) => {
    setIsSnackbarOpen(true);
    setSnackbarText(message);
    setSnackbarSeverity(severity);
  };

  const closeSnackbar = () => setIsSnackbarOpen(false);

  const submitNewReturn = async (packagingReturn) => {
    const {
      tracking_number = '',
      packaging_urls,
      warehouse_associate_id,
    } = packagingReturn;

    return axios.post(
      API_POST_PACKAGING_RETURNS,
      {
        tracking_number,
        packaging_urls,
        warehouse_associate_id,
      },
      userStore.getHeaderAuth(),
    );
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    loadingStore.toggle();
    submitNewReturn(values)
      .then((res) => {
        const {
          data: { packagingReturn, message },
        } = res;

        const messageLC = message ? message.toLowerCase() : undefined;

        if (packagingReturn) {
          openSnackbar('Packaging return submitted successfully!', 'success');
          setTimeout(() => {
            history.push('/packaging-returns');
          }, 2400);
        } else if (messageLC && messageLC.includes('tracking')) {
          setShowTrackingInputDialog(true);
          resetForm({
            tracking_number: [],
          });
        } else if (messageLC && messageLC.includes('report')) {
          openSnackbar(
            "Packaging return couldn't be completed. Report sent to Ops team.",
            'info',
          );
        }
      })
      .catch((error) => {
        openSnackbar(
          error.message
            ? error.message
            : 'Submission failed, something went wrong!',
          'error',
        );
      })
      .finally(() => {
        setSubmitting(false);
        setTimeout(() => loadingStore.toggle(), 300);
      });
  };

  return (
    <Grid container>
      <Typography variant={'h2'} gutterBottom>
        Packaging
      </Typography>
      <Grid item container xs={12} justify="center">
        <Formik
          initialValues={{
            tracking_number: '',
            packaging_urls: [],
            warehouse_associate_id: user_id,
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            packaging_urls: Yup.array()
              .of(Yup.string())
              .min(1, 'Atleast have one item to submit')
              .required(),
          })}
        >
          <Form fullWidth={true} className={styles.form}>
            <TrackingDialogInput
              show={showTrackingInputDialog}
              setShow={(val) => {
                setShowTrackingInputDialog(val);
              }}
            />
            <FieldArray
              name="packaging_urls"
              component={FormikScanInputComponent}
            />
            <ErrorMessage
              name="packaging_urls"
              component={FormHelperText}
              error={true}
            />
          </Form>
        </Formik>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default withRouter(NewReturnForm);
