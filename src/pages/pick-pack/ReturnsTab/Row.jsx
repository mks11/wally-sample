import React from "react";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { CheckCircle, HighlightOff } from "@material-ui/icons";
import { STATUS_RETURNED } from ".";
import styles from "./Row.module.css";

export default function Row({ index, style, data }) {
  const item = data[index];
  const { status, name } = item;
  const isReturned = status === STATUS_RETURNED;
  return (
    <ListItem style={style} alignItems="center" component="div">
      <ListItemText primary={name} />
      <ListItemIcon>
        <div className={styles.iconContainer}>
          {isReturned ? (
            <CheckCircle color="primary" />
          ) : (
            <HighlightOff color="secondary" />
          )}
          {status && (
            <div>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
          )}
        </div>
      </ListItemIcon>
    </ListItem>
  );
}
