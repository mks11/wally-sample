import React, { useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { connect } from "utils";
import NewReturnForm from "./NewReturnForm";
import Page from "../shared/Tab";
import styles from "./index.module.css";
import { Observer } from "mobx-react";

function NewPackagingReturn({
  store: { user: userStore, packagingReturn: returnStore },
}) {
  const user_id = userStore.user && userStore.user._id;
  const { token = {} } = userStore;

  const handleRemoveItemByIndex = (i) => {
    const n = returnStore.packaging_urls.length;
    returnStore.removeUrlByIndex(n - i - 1); // we are showing items in reverse currently
  };

  const handleClearEntries = () => {
    returnStore.clearEntries();
  };

  return (
    <Observer>
      {() => (
        <Page
          title="New Packaging Return"
          className={styles.pageContainer}
          maxWidth="sm"
        >
          <NewReturnForm
            packagingURLs={returnStore.packaging_urls.toJS().reverse()}
            user_id={user_id}
            onClearEntries={handleClearEntries}
            removeItemByIndex={handleRemoveItemByIndex}
            returnStore={returnStore}
          />
        </Page>
      )}
    </Observer>
  );
}

//mobx v5 fix
class A extends React.Component {
  render() {
    return <NewPackagingReturn {...this.props} />;
  }
}

export default connect("store")(A);
