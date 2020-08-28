import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { connect } from "utils";

function RootSnackbar({ store: { snackbar } }) {
  return (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={6000}
      onClose={snackbar.closeSnackbar}
    >
      <Alert onClose={snackbar.closeSnackbar} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export default connect("store")(RootSnackbar);
