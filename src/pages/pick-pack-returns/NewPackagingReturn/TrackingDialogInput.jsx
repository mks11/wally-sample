import React, { useState, useEffect } from "react";
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
    setFieldValue("Tracking_id", trackId, (v) => !v);
  };

  const handleChange = (e) => {
    setTrackId(e.target.value);
    e.preventDefault();
  };

  useEffect(() => {
    if (!!values["Tracking_id"]) {
      submitForm();
    }
  }, [values["Tracking_id"]]);

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
