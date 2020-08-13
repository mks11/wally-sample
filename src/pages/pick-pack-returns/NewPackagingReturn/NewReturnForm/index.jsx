import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Snackbar, FormHelperText } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { API_POST_PACKAGING_RETURNS } from "../../../../config";
import TrackingDialogInput from "./TrackingDialogInput";
import { withRouter } from "react-router-dom";
import FormikScanInputComponent from "./FormikScanInputComponent";

const SUCCESS_COMPLETED = "successType1";
const SUCCESS_REQUIRES_TRACKING = "successType2";
const SUCCESS_NOT_COMPLETED = "successType3";

const NOT_COMPLETED_MESSAGE =
  "Packaging return couldn't be completed. Report sent to Ops team.";
const ERROR_MESSAGE = "Submission failed, something went wrong!";

const getCorrectTypeOfSuccess = (data = {}) => {
  const { packagingReturn, message = "" } = data;
  const messageLC = message.toLowerCase();
  if (packagingReturn) {
    return SUCCESS_COMPLETED;
  } else if (
    // Expected Message: 'Enter the tracking number to complete the return.'
    messageLC.includes("enter") &&
    messageLC.includes("tracking")
  ) {
    return SUCCESS_REQUIRES_TRACKING;
  } else if (
    //Expected Message: "Packaging return couldn't be completed. Report sent to Ops team."
    messageLC.includes("report") &&
    messageLC.includes("ops")
  ) {
    return SUCCESS_NOT_COMPLETED;
  }
};

function NewReturnForm({ user_id, history, location }) {
  const [successType, setSuccessType] = useState();
  const [isErrorOnSubmit, setErrorOnSubmit] = useState(false);
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);
  const [showNotCompletedAlert, setShowNotCompletedAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { token } = location.state || {};

  useEffect(() => {
    if (successType === SUCCESS_REQUIRES_TRACKING) {
      setShowTrackingInputDialog(true);
    } else {
      if (successType === SUCCESS_NOT_COMPLETED) {
        setShowNotCompletedAlert(true);
      }
      if ([SUCCESS_NOT_COMPLETED, SUCCESS_COMPLETED].includes(successType)) {
        setTimeout(() => {
          history.push("/pick-pack-returns");
        }, 2400);
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
    return response;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setErrorOnSubmit(false);
      const { status, data } = await submitNewReturn(values);
      if (status === 200) {
        const successType = getCorrectTypeOfSuccess(data);
        if (successType !== SUCCESS_REQUIRES_TRACKING) {
          resetForm({
            tracking_number: [],
          });
        }
        setSuccessType(successType);
      }
    } catch (e) {
      setErrorOnSubmit(true);
    } finally {
      setSubmitting(false);
      setSuccessType(null);
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
      <Grid item container xs={12} justify="center">
        <Formik
          initialValues={{
            tracking_number: "",
            packaging_urls: [],
            warehouse_associate_id: user_id,
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            packaging_urls: Yup.array()
              .of(Yup.string())
              .min(1, "Atleast have one item to submit")
              .required(),
          })}
        >
          <Form
            fullWidth={true}
            style={{
              border: "1px solid blue",
              flex: 1,
              // justifyContent: "center",
              // alignItems: "center",
              // display: "flex",
              // flexDirection: "column",
              // width: "100%",
            }}
          >
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
    </Grid>
  );
}

export default withRouter(NewReturnForm);
