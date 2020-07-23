import React, { useEffect, useState } from "react";
import Tab from "./../shared/Tab";
import Get from "./SubmitGet";
import {
  Card,
  List,
  ListItemSecondaryAction,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { AddCircle } from "@material-ui/icons";
import axios from "axios";
import {
  API_GET_TODAYS_PACKAGING_RETURNS,
  API_GET_PACKAGING_RETURNS_JOB,
} from "../../../config";
import { connect } from "utils";
import Row from "./Row";
import { genRandomReturnData } from "./gen";
import { sortByTimestampDes } from "utils";
export const STATUS_RECEIVED = "received";
export const STATUS_RETURNED = "returned";

function ReturnsTab({ store: { user: userStore } }) {
  const [returnItems, setReturnItems] = useState([]);
  const [loading, setLoading] = useState(true); // default true .. so that no empty msg is shown at the load
  const [error, setError] = useState();
  const [successMsgOnReturnSubmit, setSuccessMsgOnReturnSubmit] = useState("");

  const fetchTodaysPackagingReturns = async () => {
    // const url = API_GET_TODAYS_PACKAGING_RETURNS;
    // const res = await axios.get(url);
    // const returnItems = res.data; //TODO test
    // return returnItems;
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = genRandomReturnData();
        res(data);
      }, 3000);
    });
  };

  const handleCompletionReturns = ({ data }) => {
    if (data.status === "200") {
      setSuccessMsgOnReturnSubmit(data.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const returnItems = await fetchTodaysPackagingReturns();
        setReturnItems(sortByTimestampDes(returnItems || [], "return_date"));
      } catch (e) {
        setError("Failed to get packaging returns");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const OnEmpty = () => (
    <Typography> No items currently! check back later </Typography>
  );
  const OnError = () => <Typography variant="error"> {error} </Typography>;

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
    <Tab
      title="Returns"
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        height: "80vh",
      }}
    >
      {returnItems.length === 0 ? (
        <Grid container justify="center">
          <Status />
        </Grid>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            color="default"
            startIcon={<AddCircle />}
            href="/pick-pack-returns/packaging-return/new"
          >
            New Return
          </Button>
          <div style={{ flex: 1 }}>
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
        <Grid container justify="center" style={{ marginTop: "1rem" }}>
          <Get
            title={"Submit Returns"}
            loadTitle={"Submitting .. "}
            onCompletion={handleCompletionReturns}
            onErrorMsg={"Submission failed!"}
            onSuccessMsg={successMsgOnReturnSubmit}
            url={API_GET_PACKAGING_RETURNS_JOB}
          />
        </Grid>
      )}
    </Tab>
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
