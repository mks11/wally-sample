import React from "react";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { CheckCircle, LinearScale } from "@material-ui/icons";
import { STATUS_RETURNED } from ".";

export default function Row({ index, style, data }) {
  const item = data[index];
  const { status, name } = item;
  const isReturned = status === STATUS_RETURNED;
  return (
    <ListItem style={style} alignItems="center" component="div">
      <ListItemText primary={`${name}`} />
      <ListItemIcon>
        {isReturned ? (
          <CheckCircle color="success" />
        ) : (
          <LinearScale color="warning" />
        )}
      </ListItemIcon>
    </ListItem>
  );
}
