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
  Box,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import SelectOneDialog from "./OnMissingOptions.dialog";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { API_POST_PACKAGING_RETURNS } from "../../../../config";
import TrackingDialogInput from "./TrackingDialogInput";
import { withRouter } from "react-router-dom";
import styles from "./index.module.css";
import uuid from "uuid";
import MissingQRCodeButton from "./MissingQRCodeButton";
import ScanQRCode from "./ScanQRCode";

const SUCCESS_COMPLETED = "successType1";
const SUCCESS_REQUIRES_TRACKING = "successType2";
const SUCCESS_NOT_COMPLETED = "successType3";

const NOT_COMPLETED_MESSAGE =
  "Packaging return couldn't be completed. Report sent to Ops team.";
const ERROR_MESSAGE = "Submission failed, something went wrong!";

function NewReturnForm({
  user_id,
  packagingURLs = [],
  history,
  location,
  onClearEntries,
  removeItemByIndex,
  children,
  returnStore,
}) {
  const [successType, setSuccessType] = useState();
  const [isErrorOnSubmit, setErrorOnSubmit] = useState(false);
  const [showTrackingInputDialog, setShowTrackingInputDialog] = useState(false);
  const [showNotCompletedAlert, setShowNotCompletedAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showOptionsOnMissing, setShowOptionsOnMissing] = useState(false);
  const { token } = location.state || {};
  const handleMissingQRCode = () => {
    setShowOptionsOnMissing(true);
  };
  //todo rename
  const handleClose = (selectedValue) => {
    setShowOptionsOnMissing(false);
    if (selectedValue) {
      returnStore.addPackagingURL(selectedValue);
    }
  };

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
    return response;
  };

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setErrorOnSubmit(false);
      const { status, data } = await submitNewReturn(values);
      if (status === 200) {
        const successType = getCorrectTypeOfSuccess(data);
        if (successType !== SUCCESS_REQUIRES_TRACKING) {
          onClearEntries();
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
            packaging_urls: packagingURLs,
            warehouse_associate_id: user_id,
          }}
          enableReinitialize={true} //imp! to keep the form always in sync with the store
          onSubmit={handleSubmit}
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
              // margin: "0 auto",
            }}
          >
            <TrackingDialogInput
              show={showTrackingInputDialog}
              setShow={(val) => {
                setShowTrackingInputDialog(val);
              }}
            />
            <Grid item xs={12} className={styles.pseudoInputContainer}>
              {!packagingURLs.length && (
                <Typography variant={"subtitle1"} color={"textSecondary"}>
                  Start scanning ...
                </Typography>
              )}
              <List dense>
                {packagingURLs.map((url, i) => (
                  <ListItem key={uuid()}>
                    <ListItemText>
                      <Typography className={styles.url} variant="body2">
                        {url}
                      </Typography>
                    </ListItemText>
                    <ListItemSecondaryAction
                      onClick={() => removeItemByIndex(i)}
                    >
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Box p={2}>
              <Button
                color="primary"
                type="submit"
                size={"large"}
                variant={"contained"}
                disabled={!packagingURLs.length}
              >
                Submit
              </Button>
            </Box>
            <Grid
              // item
              container
              xs={12}
              justify="center"
              spacing={2}
              style={{ border: "1px solid blue" }}
              alignItems="center"
            >
              <SelectOneDialog
                open={showOptionsOnMissing}
                onClose={handleClose}
              />
              <Grid container item xs={6} justify="center">
                <MissingQRCodeButton onClick={handleMissingQRCode} />
              </Grid>
              <Grid container item xs={6} justify="center">
                <ScanQRCode returnStore={returnStore} />
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Grid>
    </Grid>
  );
}

export default withRouter(NewReturnForm);
