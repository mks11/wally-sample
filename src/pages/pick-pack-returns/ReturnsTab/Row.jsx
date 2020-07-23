import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@material-ui/core";
import { CheckCircle, LinearScale } from "@material-ui/icons";
import moment from "moment";
import { STATUS_RETURNED } from ".";

export default function Row({ index, style, data }) {
  const item = data[index];
  const { status, name, return_date } = item;
  const isReturned = status === STATUS_RETURNED ? true : false;
  const msg = moment(return_date).fromNow();
  return (
    <ListItem style={style} alignItems="center" component="div">
      <ListItemText primary={`${name}`} secondary={msg} />
      <ListItemIcon>
        {isReturned ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          <LinearScale style={{ color: "#FDD835" }} />
        )}
      </ListItemIcon>
    </ListItem>
  );
}
