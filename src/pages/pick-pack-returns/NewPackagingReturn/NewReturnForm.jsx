import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import {
  Grid,
  Button,
  ListItem,
  ListItemText,
  List,
  Divider,
  Snackbar,
  FormHelperText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { API_POST_PACKAGING_RETURNS } from "../../../config";
import TrackingDialogInput from "./TrackingDialogInput";
import { withRouter } from "react-router-dom";

const SUCCESS_COMPLETED = "successType1";
const SUCCESS_REQUIRES_TRACKING = "successType2";
const SUCCESS_NOT_COMPLETED = "successType3";

//TODO ask for persistance

function NewReturnForm({ user_id, packagingURLs = [], history }) {
  const [successType, setSuccessType] = useState();
  const [isErrorOnSubmit, setErrorOnSubmit] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);
  const [showNotCompletedAlert, setShowNotCompletedAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // if (!user_id) {
  //   return <div>Please login!</div>;
  // }
  const submitNewReturn = async ({
    Tracking_id = "",
    packaging_urls,
    warehouse_associate_id,
  }) => {
    const url = API_POST_PACKAGING_RETURNS;
    return await axios.post(url, {
      Tracking_id,
      packaging_urls,
      warehouse_associate_id,
    });
  };

  const setCorrectTypeOfSuccess = (data = {}) => {
    const { packagingReturn, message } = data;
    if (packagingReturn) {
      //TODO check the logic
      setSuccessType(SUCCESS_COMPLETED);
    } else if (
      message && // Expected Message: 'Enter the tracking number to complete the return.'
      message.toLowerCase() &&
      message.includes("enter") &&
      message.includes("tracking")
    ) {
      setSuccessType(SUCCESS_REQUIRES_TRACKING);
    } else if (
      message && //Expected Message: "Packaging return couldn't be completed. Report sent to Ops team."
      message.toLowerCase() &&
      message.includes("report") &&
      message.includes("ops")
    ) {
      setSuccessType(SUCCESS_NOT_COMPLETED);
    }
  };

  const sendUserBackToReturnTab = () => {
    history.push("/pick-pack-returns");
  };

  useEffect(() => {
    if (successType === SUCCESS_COMPLETED) {
      setShowSuccessAlert(true);
      sendUserBackToReturnTab();
    } else if (successType === SUCCESS_REQUIRES_TRACKING) {
      setShowTrackingInputDialog(true);
    } else if (successType === SUCCESS_NOT_COMPLETED) {
      setShowNotCompletedAlert(true);
      sendUserBackToReturnTab();
    }
  }, [successType]);

  useEffect(() => {
    if (isErrorOnSubmit) {
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  }, [isErrorOnSubmit]);

  const handleSubmit = async (values, { setSubmitting }) => {
    // setTimeout(() => {
    //   alert(JSON.stringify(values));
    //   setSubmitting(false);
    //   setShowTrackingInputDialog(false);
    // }, 400);
    try {
      setErrorOnSubmit(false);
      const { status, data } = await submitNewReturn(values);
      if (status === "200") {
        setCorrectTypeOfSuccess(data);
      }
    } catch (e) {
      console.error(e.message);
      setErrorOnSubmit(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container>
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
      >
        <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
          Request submitted successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showNotCompletedAlert}
        autoHideDuration={6000}
        onClose={() => setShowNotCompletedAlert(false)}
      >
        <Alert onClose={() => setShowNotCompletedAlert(false)} severity="info">
          Packaging return couldn't be completed. Report sent to Ops team.
        </Alert>
      </Snackbar>
      <Snackbar open={showErrorAlert} onClose={() => setShowErrorAlert(false)}>
        <Alert onClose={() => setShowErrorAlert(false)} severity="error">
          Submission failed, something went wrong!
        </Alert>
      </Snackbar>
      <Grid
        item
        xs={12}
        spacing={1}
        style={{
          maxHeight: "40vh",
          minHeight: "40vh",
          overflow: "auto",
          boxShadow: "1px 1px 4px 0px #bbb inset",
          backgroundColor: "#fafafa",
        }}
      >
        {!packagingURLs.length && (
          <FormHelperText> Start scanning ... </FormHelperText>
        )}
        <List dense>
          {packagingURLs.map((url, i) => (
            <ListItem key={`${url + i}`}>
              <ListItemText>
                <Typography
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    // maxWidth: "400px",
                  }}
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
            Tracking_id: "",
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
