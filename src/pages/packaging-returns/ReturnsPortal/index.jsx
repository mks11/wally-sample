import React, { useEffect, useState } from 'react';
import { Observer } from 'mobx-react';
import { groupBy } from 'lodash-es';
import axios from 'axios';

// Packaged Components
import { Link } from 'react-router-dom';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Typography, Grid } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';

// Wally Components
import Tab from './../shared/Tab';
import FetchButton from './FetchButton';
import Row from './Row';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// Routes
import {
  API_GET_TODAYS_PACKAGING_RETURNS,
  API_GET_PACKAGING_RETURNS_JOB,
} from '../../../config';

// Utilities
import { connect } from 'utils';
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

function ReturnsPortal({
  store: { user: userStore, loading: loadingStore, modal: modalStore },
}) {
  const [returnItems, setReturnItems] = useState([]);
  const [successMsgOnReturnSubmit, setSuccessMsgOnReturnSubmit] = useState('');
  const { token } = userStore;

  const fetchTodaysPackagingReturns = async () => {
    return axios.get(
      API_GET_TODAYS_PACKAGING_RETURNS,
      userStore.getHeaderAuth(),
    );
  };

  const handleCompletionReturns = (response) => {
    const {
      status,
      data: { message },
    } = response;
    if (status === 200) {
      setSuccessMsgOnReturnSubmit(message);
    }
  };

  useEffect(() => {
    loadingStore.toggle();
    fetchTodaysPackagingReturns()
      .then((res) => {
        const {
          data: { details },
        } = res;
        if (details.length) {
          setReturnItems(sortItemsByStatus(details));
        }
      })
      .catch((err) => {
        modalStore.toggleModal('error', err.message ? err.message : undefined);
      })
      .finally(() => setTimeout(() => loadingStore.toggle(), 300));
  }, [successMsgOnReturnSubmit]);

  return (
    <Observer>
      {() => (
        <Tab title="Returns" maxWidth="sm">
          <Grid container justify="center" spacing={4}>
            {userStore.user && userStore.isOpsLead && returnItems.length > 0 && (
              <Grid item xs={6}>
                <FetchButton
                  title={'Submit Returns'}
                  loadTitle={'Submitting ... '}
                  onCompletion={handleCompletionReturns}
                  onErrorMsg={'Submission failed!'}
                  onSuccessMsg={successMsgOnReturnSubmit}
                  url={API_GET_PACKAGING_RETURNS_JOB}
                  userStore={userStore}
                  loadingStore={loadingStore}
                />
              </Grid>
            )}
            <Grid item xs={userStore.isOpsLead ? 6 : 12}>
              <PrimaryWallyButton
                to={{
                  pathname: '/packaging-returns/new',
                  state: { token: token.accessToken },
                }}
                fullWidth={true}
                component={Link}
                startIcon={<AddCircle />}
                size={'large'}
              >
                <Typography variant="body1">New Return</Typography>
              </PrimaryWallyButton>
            </Grid>
            {returnItems.length ? (
              <Grid item xs={12} style={{ height: '80vh' }}>
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
              </Grid>
            ) : (
              <Grid item>
                <Typography variant="body1">
                  No returns have been processed today.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Tab>
      )}
    </Observer>
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
