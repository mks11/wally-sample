import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import {
  Grid,
  Button,
  ListItem,
  ListItemText,
  List,
  Snackbar,
  FormHelperText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { API_POST_PACKAGING_RETURNS } from "../../../config";
import TrackingDialogInput from "./TrackingDialogInput";
import { withRouter } from "react-router-dom";
import styles from "./NewReturnForm.module.css";

const SUCCESS_COMPLETED = "successType1";
const SUCCESS_REQUIRES_TRACKING = "successType2";
const SUCCESS_NOT_COMPLETED = "successType3";

const NOT_COMPLETED_MESSAGE =
  "Packaging return couldn't be completed. Report sent to Ops team.";
const ERROR_MESSAGE = "Submission failed, something went wrong!";

function NewReturnForm({ user_id, packagingURLs = [], history, location }) {
  const [successType, setSuccessType] = useState();
  const [isErrorOnSubmit, setErrorOnSubmit] = useState(false);
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);
  const [showNotCompletedAlert, setShowNotCompletedAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { token } = location.state;
  useEffect(() => {
    if (successType === SUCCESS_REQUIRES_TRACKING) {
      setShowTrackingInputDialog(true);
    } else {
      if (successType === SUCCESS_NOT_COMPLETED) {
        setShowNotCompletedAlert(true);
      }
      if ([SUCCESS_NOT_COMPLETED, SUCCESS_COMPLETED].includes(successType)) {
        history.push("/pick-pack-returns");
      }
    }
  }, [history, successType]);

  useEffect(() => {
    if (isErrorOnSubmit) {
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  }, [isErrorOnSubmit]);

  const submitNewReturn = async ({
    tracking_number = "",
    packaging_urls,
    warehouse_associate_id,
  }) => {
    const url = API_POST_PACKAGING_RETURNS;
    const response = await axios.post(
      url,
      {
        tracking_number,
        packaging_urls,
        warehouse_associate_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  };

  const setCorrectTypeOfSuccess = (data = {}) => {
    const { packagingReturn, message = "" } = data;
    if (packagingReturn) {
      setSuccessType(SUCCESS_COMPLETED);
    } else if (
      // Expected Message: 'Enter the tracking number to complete the return.'
      message.toLowerCase() &&
      message.includes("enter") &&
      message.includes("tracking")
    ) {
      setSuccessType(SUCCESS_REQUIRES_TRACKING);
    } else if (
      //Expected Message: "Packaging return couldn't be completed. Report sent to Ops team."
      message.toLowerCase() &&
      message.includes("report") &&
      message.includes("ops")
    ) {
      setSuccessType(SUCCESS_NOT_COMPLETED);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setErrorOnSubmit(false);
      const { status, data } = await submitNewReturn(values);
      if (status === 200) {
        setCorrectTypeOfSuccess(data);
      }
    } catch (e) {
      setErrorOnSubmit(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container>
      <Typography variant={"h5"}> Packaging </Typography>
      <Snackbar
        open={showNotCompletedAlert}
        autoHideDuration={6000}
        onClose={() => setShowNotCompletedAlert(false)}
      >
        <Alert onClose={() => setShowNotCompletedAlert(false)} severity="info">
          {NOT_COMPLETED_MESSAGE}
        </Alert>
      </Snackbar>
      <Snackbar open={showErrorAlert} onClose={() => setShowErrorAlert(false)}>
        <Alert onClose={() => setShowErrorAlert(false)} severity="error">
          {ERROR_MESSAGE}
        </Alert>
      </Snackbar>
      <Grid item xs={12} spacing={1} className={styles.pseudoInputContainer}>
        {!packagingURLs.length && (
          <FormHelperText> Start scanning ... </FormHelperText>
        )}
        <List dense>
          {packagingURLs.map((url, i) => (
            <ListItem key={`${url + i}`}>
              <ListItemText>
                <Typography
                  className={styles.url}
                  maxWidth="sm"
                  variant="body2"
                >
                  {url}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item container xs={12} justify="center">
        <Formik
          initialValues={{
            tracking_number: "",
            packaging_urls: packagingURLs,
            warehouse_associate_id: user_id,
          }}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          <Form>
            <TrackingDialogInput
              show={showTrackingInputDialog}
              setShow={(val) => {
                setShowTrackingInputDialog(val);
              }}
            />
            <Button color="primary" type="submit" size="large">
              Submit
            </Button>
          </Form>
        </Formik>
      </Grid>
    </Grid>
  );
}

export default withRouter(NewReturnForm);
