import React, { useEffect, useState } from "react";
import Tab from "./../shared/Tab";
import {
  Card,
  List,
  ListItemSecondaryAction,
  Typography,
  Button,
  Grid,
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

export const STATUS_RECEIVED = "received";
export const STATUS_RETURNED = "returned";

function ReturnsTab({ store: { user: userStore } }) {
  const [returnItems, setReturnItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchTodaysPackagingReturns = async () => {
    // const url = API_GET_TODAYS_PACKAGING_RETURNS;
    // const res = await axios.get(url);
    // const returnItems = res.data; //TODO test
    // return returnItems;
    return new Promise((res, rej) => {
      setTimeout(() => {
        const data = genRandomReturnData();
        res(data);
      }, 300);
    });
  };

  const handleNewReturnSubmit = () => {
    const url = API_GET_PACKAGING_RETURNS_JOB;
    // TODO ask is it a link we move to?
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const returnItems = await fetchTodaysPackagingReturns();
        setReturnItems(returnItems || []);
      } catch (e) {
        setError("Failed to get today's packaging returns"); //TODO review the msg with Brian
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const OnEmpty = () => (
    <Typography> No returns currently! check back later </Typography>
  );
  const OnError = () => <Typography variant="error"> {error} </Typography>;
  // TODO check the empty length message with Brian
  // TODO Autosize not working

  return (
    <Tab
      title="Returns"
      style={{
        border: "1px solid blue",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        height: "80vh",
      }}
    >
      {returnItems.length === 0 ? ( // TODO debug remove !
        !error ? (
          <OnEmpty />
        ) : (
          <OnError />
        )
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            color="default"
            startIcon={<AddCircle />}
            href="#" //TODO
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
      {userStore.user &&
      userStore.isOpsLead && ( //TODO ask why it's logging out
          <Grid container justify="center">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleNewReturnSubmit}
              >
                Submit Returns
              </Button>
            </Grid>
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
