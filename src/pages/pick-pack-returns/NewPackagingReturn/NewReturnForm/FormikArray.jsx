import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Delete as DeleteIcon } from "@material-ui/icons";
import {
  TextField,
  ListItem,
  List,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  ListItemText,
} from "@material-ui/core";

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const FriendList = () => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={{ friends: ["jared", "ian", "brent"] }}
      onSubmit={(values) =>
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        }, 500)
      }
      render={({ values }) => (
        <Form>
          <FieldArray
            name="friends"
            render={(arrayHelpers) => (
              <div>
                <div>Ok</div>
                <List>
                  {values.friends.map((friend, index) => (
                    <ListItem key={index}>
                      <ListItemText>
                        <Typography variant="body2">{friend}</Typography>
                      </ListItemText>
                      <ListItemSecondaryAction
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </List>
              </div>
            )}
          />
        </Form>
      )}
    />
  </div>
);
