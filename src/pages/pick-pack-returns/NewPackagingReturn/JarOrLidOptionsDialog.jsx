import React from "react";
import {
  ListItem,
  ListItemText,
  List,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import { useStyles, emails } from "./index";
import PropTypes from "prop-types";

export default function JarOrLidDialog({ open, onClose, selectedValue }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="select jar or lid"
      open={open}
    >
      <DialogTitle id="Select One">Please select one</DialogTitle>
      <List>
        {["Jar", "Lid"].map((type) => (
          <ListItem
            button
            onClick={() => handleListItemClick(type)}
            key={type}
            style={{ minWidth: "200px" }}
          >
            <ListItemText primary={type} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

JarOrLidDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
