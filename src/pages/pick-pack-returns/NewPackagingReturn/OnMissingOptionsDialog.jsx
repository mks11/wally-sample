import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemText,
  List,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import styles from "./OnMissingOptionsDialog.module.css";

export default function OnMissingOptionsDialog({
  open,
  onClose,
  selectedValue,
}) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="select jar or tote"
      open={open}
    >
      <DialogTitle id="Select One">Please select one</DialogTitle>
      <List>
        {["Jar", "Tote"].map((type) => (
          <ListItem
            button
            onClick={() => handleListItemClick(type)}
            key={type}
            className={styles.itemContainer}
          >
            <ListItemText primary={type} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

OnMissingOptionsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
