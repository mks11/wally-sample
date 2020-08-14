import React, { useEffect, useState } from 'react';
import { Observer } from 'mobx-react';
import styles from './ReturnsTab.module.css';
import Tab from './../shared/Tab';
import FetchButton from './FetchButton';
import { Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { groupBy } from 'lodash-es';

import { AddCircle } from '@material-ui/icons';
import axios from 'axios';
import {
  API_GET_TODAYS_PACKAGING_RETURNS,
  API_GET_PACKAGING_RETURNS_JOB,
} from '../../../config';
import { connect } from 'utils';
import Row from './Row';
import { sortByTimestampDes } from 'utils';
export const STATUS_RECEIVED = 'received';
export const STATUS_RETURNED = 'returned';

function sortItemsByStatus(items) {
  const grouped = groupBy(items, 'status');
  const numGroups = Object.keys(grouped).length;
  if (numGroups > 1) {
    const { received, returned } = grouped;
    return [
      ...sortByTimestampDes(received, 'return_date'),
      ...sortByTimestampDes(returned, 'return_date'),
    ];
  } else {
    return sortByTimestampDes(items, 'return_date');
  }
}

function ReturnsPortal({ store: { user: userStore, loading: loadingStore } }) {
  const [returnItems, setReturnItems] = useState([]);
  const [error, setError] = useState();
  const [successMsgOnReturnSubmit, setSuccessMsgOnReturnSubmit] = useState('');
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
        loadingStore.toggle();
        userStore.getStatus();
        const returnItems = await fetchTodaysPackagingReturns();
        if (returnItems.length) {
          setReturnItems(sortItemsByStatus(returnItems));
        }
      } catch (e) {
        console.error(e);
        setError('Failed to get packaging returns');
      } finally {
        loadingStore.toggle();
      }
    })();
  }, []);

  const Status = () => {
    if (error) {
      return <OnError error={error} />;
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
                    pathname: '/packaging-returns/new',
                    state: { token: token.accessToken },
                  }}
                  variant="contained"
                  color="primary"
                  style={{ color: '#fff' }}
                  fullWidth={true}
                  component={Link}
                  startIcon={<AddCircle />}
                  size={'large'}
                >
                  <Typography variant="body1">New Return</Typography>
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
                title={'Submit Returns'}
                loadTitle={'Submitting ... '}
                onCompletion={handleCompletionReturns}
                onErrorMsg={'Submission failed!'}
                onSuccessMsg={successMsgOnReturnSubmit}
                url={API_GET_PACKAGING_RETURNS_JOB}
                userStore={userStore}
              />
            </Grid>
          )}
        </Tab>
      )}
    </Observer>
  );
}

function OnEmpty() {
  return (
    <Typography variant="body1">
      No returns have been processed today.
    </Typography>
  );
}

function OnError({ error }) {
  return (
    <Typography color="error" variant="body1">
      {error}
    </Typography>
  );
}

// needed to wrap it because connect("store") on CleaningUpdateForm
// gives 'invalid hook call' error
class _ReturnsPortal extends React.Component {
  render() {
    return <ReturnsPortal {...this.props} />;
  }
}

export default connect('store')(_ReturnsPortal);
