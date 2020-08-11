import React, { useEffect, useState } from "react";
import { Observer } from "mobx-react";
import styles from "./ReturnsTab.module.css";
import Tab from "./../shared/Tab";
import FetchButton from "./FetchButton";
import { Typography, Button, Grid, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { groupBy } from "lodash-es";

import { AddCircle } from "@material-ui/icons";
import axios from "axios";
import {
  API_GET_TODAYS_PACKAGING_RETURNS,
  API_GET_PACKAGING_RETURNS_JOB,
} from "../../../config";
import { connect } from "utils";
import Row from "./Row";
import { sortByTimestampDes } from "utils";
export const STATUS_RECEIVED = "received";
export const STATUS_RETURNED = "returned";

function sortItemsByStatus(items) {
  const { received, returned } = groupBy(items, "status");
  return [
    ...sortByTimestampDes(received, "return_date"),
    ...sortByTimestampDes(returned, "return_date"),
  ];
}

function ReturnsTab({ store: { user: userStore } }) {
  const [returnItems, setReturnItems] = useState([]);
  const [loading, setLoading] = useState(true); // default true .. so that no empty msg is shown at the load
  const [error, setError] = useState();
  const [successMsgOnReturnSubmit, setSuccessMsgOnReturnSubmit] = useState("");
  const { token } = userStore;

  const fetchTodaysPackagingReturns = async () => {
    const url = API_GET_TODAYS_PACKAGING_RETURNS;
    const {
      data: { details },
    } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    return details;
  };

  const handleCompletionReturns = ({ status, data: { message } }) => {
    if (status === 200) {
      setSuccessMsgOnReturnSubmit(message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        userStore.getStatus();
        const returnItems = await fetchTodaysPackagingReturns();
        setReturnItems(sortItemsByStatus(returnItems));
      } catch (e) {
        setError("Failed to get packaging returns");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const OnEmpty = () => (
    <Typography> No returns have been processed today. </Typography>
  );
  const OnError = () => <Typography color="error"> {error} </Typography>;

  const Status = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (error) {
      return <OnError />;
    }
    return <OnEmpty />;
  };

  return (
    <Observer>
      {() => (
        <Tab title="Returns" className={styles.tabContainer} maxWidth="sm">
          {returnItems.length === 0 ? (
            <Grid container justify="center">
              <Status />
            </Grid>
          ) : (
            <div className={styles.contentContainer}>
              <Grid container justify="center">
                <Button
                  to={{
                    pathname: "/pick-pack-returns/packaging-return/new",
                    state: { token: token.accessToken },
                  }}
                  fullWidth={true}
                  component={Link}
                  startIcon={<AddCircle />}
                  size={"large"}
                >
                  New Return
                </Button>
              </Grid>
              <div className={styles.listContainer}>
                <AutoSizer>
                  {({ height, width }) => {
                    return (
                      <FixedSizeList
                        height={height}
                        width={width}
                        itemSize={80}
                        itemCount={returnItems.length}
                        itemData={returnItems}
                      >
                        {Row}
                      </FixedSizeList>
                    );
                  }}
                </AutoSizer>
              </div>
            </div>
          )}
          {userStore.user && userStore.isOpsLead && (
            <Grid
              container
              justify="center"
              className={styles.submitButtonContainer}
            >
              <FetchButton
                title={"Submit Returns"}
                loadTitle={"Submitting ... "}
                onCompletion={handleCompletionReturns}
                onErrorMsg={"Submission failed!"}
                onSuccessMsg={successMsgOnReturnSubmit}
                url={API_GET_PACKAGING_RETURNS_JOB}
              />
            </Grid>
          )}
        </Tab>
      )}
    </Observer>
  );
}

// needed to wrap it because connect("store") on CleaningUpdateForm
// gives 'invalid hook call' error
class _ReturnsTab extends React.Component {
  render() {
    return <ReturnsTab {...this.props} />;
  }
}

export default connect("store")(_ReturnsTab);
