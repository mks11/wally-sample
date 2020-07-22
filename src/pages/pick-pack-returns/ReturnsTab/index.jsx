import React, { useEffect, useState } from "react";
import Tab from "./../shared/Tab";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { CheckCircle, AddCircle, LinearScale } from "@material-ui/icons";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import axios from "axios";
import {
  API_GET_TODAYS_PACKAGING_RETURNS,
  API_GET_PACKAGING_RETURNS_JOB,
} from "../../../config";
import { connect } from "utils";

function renderRow({ index, style, isReturned, isMostRecent }) {
  // TODO show a title below the indicator
  return (
    <ListItem style={style} alignItems="center" component="div">
      <ListItemText primary={`Item ${index + 1}`} />
      {/* <div
              style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
              }}
          >
              <ListItemIcon>
                  <CheckCircle />
              </ListItemIcon>
              <h6>Recieved</h6>
            </div> */}
      <ListItemIcon>
        {isReturned ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          <LinearScale style={{ color: "#FDD835" }} />
        )}
      </ListItemIcon>
      <Button
        variant="contained"
        color="default"
        startIcon={<AddCircle />}
        href="#" //TODO
      >
        New Return
      </Button>
    </ListItem>
  );
}

function ReturnsTab({ store: { user: userStore } }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchTodaysPackagingReturns = async () => {
    const url = API_GET_TODAYS_PACKAGING_RETURNS;
    const res = await axios.get(url);
    const { details } = res.data;
    return details;
  };

  const handleSubmit = () => {
    const url = API_GET_PACKAGING_RETURNS_JOB;
    // TODO ask is it a link we move to?
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const details = await fetchTodaysPackagingReturns();
        setDetails(details);
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

  console.log("userStore", userStore);

  return (
    <Tab
      title="Returns"
      style={{
        border: "1px solid blue",
        flex: 1,
        height: "100%",
      }}
    >
      <div> {details.length}</div>
      {details.length !== 0 ? ( // TODO debug remove !
        !error ? (
          <OnEmpty />
        ) : (
          <OnError />
        )
      ) : (
        <AutoSizer>
          {({ height, width }) => {
            //   console.log("height, width", height, width);
            return (
              <FixedSizeList
                height={400}
                width={width}
                itemSize={80}
                itemCount={100}
              >
                {renderRow}
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      )}
      {userStore.user &&
      userStore.isOpsLead && ( //TODO ask why it's logging out
          <Grid container justify="center">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
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
