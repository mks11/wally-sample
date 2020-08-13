import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useFormikContext } from "formik";

export default function FormDialog({ show, setShow }) {
  const { values, submitForm, setFieldValue } = useFormikContext();
  const [trackId, setTrackId] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = () => {
    setFieldValue("tracking_number", trackId, (v) => !v);
  };

  const handleChange = (e) => {
    setTrackId(e.target.value);
  };

  useEffect(() => {
    if (values["tracking_number"]) {
      submitForm();
    }
  }, [submitForm, values]);

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add Tracking ID </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The submission requires a tracking ID.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="trackingId"
            label="Tracking ID"
            type="text"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};
