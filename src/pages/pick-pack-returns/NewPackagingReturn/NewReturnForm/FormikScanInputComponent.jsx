/* eslint-disable react/prop-types */
import React, { useState } from "react";
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
} from "@material-ui/core";
import SelectOneDialog from "./OnMissingOptions.dialog";
import ScanQRCode from "./ScanQRCode";
import { Delete as DeleteIcon } from "@material-ui/icons";
import MissingQRCodeButton from "./MissingQRCodeButton";
import styles from "./index.module.css";

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
          <Typography variant={"subtitle1"} color={"textSecondary"}>
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
      <Box p={2} justifyContent={"center"} display={"flex"}>
        <Button
          color="primary"
          type="submit"
          size={"large"}
          variant={"contained"}
          disabled={!packaging_urls.length || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
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
          <MissingQRCodeButton onClick={handleMissingQRCode} />
        </Grid>
        <Grid container item xs={6} justify="center">
          <ScanQRCode onScanCompletion={handleScanCompletion} />
        </Grid>
      </Grid>
    </>
  );
}
