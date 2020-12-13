import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Material UI
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Divider,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Cancel from '@material-ui/icons/Cancel';
import DatePicker from 'react-datepicker';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Styled Components
import styled from 'styled-components';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import { API_GET_TODAYS_ORDERS, API_VALIDATE_PICK_PACK_ORDERS } from 'config';

// Styles
import styles from './PickPackTab.module.css';

function StatusIcon({ status }) {
  let className;
  let Icon;

  switch (status) {
    case 'submitted' || 'pending_packing':
      Icon = Cancel;
      className = styles.received;
      break;
    case 'pending_quality_assurance':
      Icon = Error;
      className = styles.pendingQA;
      break;
    default:
      Icon = CheckCircle;
      className = styles.complete;
      break;
  }

  return <Icon className={className} fontSize="small" />;
}

function StatusText({ status }) {
  let className;
  let text;

  switch (status) {
    case 'submitted' || 'pending_packing':
      className = styles.received;
      text = 'Not Started';
      break;
    case 'pending_quality_assurance':
      className = styles.pendingQA;
      text = 'Pending Q/A';
      break;
    default:
      className = styles.complete;
      text = status.toUpperCase();
      break;
  }

  return (
    <Typography
      variant="body2"
      className={className}
      style={{ display: 'inline-block', marginRight: '.5rem' }}
    >
      {text}
    </Typography>
  );
}

const CardHeaderWrapper = styled(Grid)`
  padding: 1rem;
`;

function CardHeader({ orderId, name, status }) {
  return (
    <>
      <CardHeaderWrapper container spacing={2}>
        <Grid item xs={12}>
          <Link to={`/pick-pack/${orderId}`}>
            <Typography variant="h4" component="span">
              Order {orderId}
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="textSecondary">
            {name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <StatusText status={status} />
            <StatusIcon status={status} />
          </Grid>
        </Grid>
      </CardHeaderWrapper>
      <Divider />
    </>
  );
}

function OrderCardContent({ orderLabel, returnLabel }) {
  return (
    <CardContent className={styles.cardContent}>
      <Grid container justify="space-evenly" alignItems="center">
        <Grid item className={styles.labelLink}>
          <a
            href={orderLabel}
            alt="Order Label"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography variant="body2">Order Label</Typography>
          </a>
        </Grid>
        <Grid item className={styles.labelLink}>
          <a
            href={returnLabel}
            alt="Return Label"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography variant="body2">Return Label</Typography>
          </a>
        </Grid>
      </Grid>
    </CardContent>
  );
}

function OrderCard({ orderDetails, isIncomplete = false }) {
  const theme = useTheme();
  const { name, orderId, inboundLabel, outboundLabel, status } = orderDetails;

  return (
    <Card
      className={`${styles.card}`}
      style={{
        border: `1px solid ${
          isIncomplete ? theme.palette.error.main : 'transparent'
        }`,
      }}
    >
      <CardHeader orderId={orderId} name={name} status={status} />
      <OrderCardContent returnLabel={inboundLabel} orderLabel={outboundLabel} />
    </Card>
  );
}

function sortOrders(a, b) {
  // Sort from received -> pending_quality_assurance -> packaged
  const aStatus = a.status;
  const bStatus = b.status;

  return aStatus < bStatus ? 1 : aStatus > bStatus ? -1 : 0;
}

function PickPackPortal() {
  const [incompleteOrders, setIncompleteOrders] = useState([]);
  const [ordersAndLabels, setOrdersAndLabels] = useState([]);
  const [ordersWereValidated, setOrdersWereValidated] = useState(false);

  const {
    loading: loadingStore,
    modal: modalStore,
    pickPack,
    user: userStore,
  } = useStores();

  // Pick/Pack State
  const { selectedDate } = pickPack;

  // User State
  const { isOpsLead, isAdmin, user, token } = userStore;

  useEffect(() => {
    loadTodaysOrders();
  }, [user, token]);

  function loadTodaysOrders() {
    if (user && token && token.accessToken) {
      loadingStore.show();
      fetchTodaysOrders(selectedDate)
        .then((res) => {
          const {
            data: { ordersAndLabels },
          } = res;

          if (ordersAndLabels.length) {
            setOrdersAndLabels(ordersAndLabels);
          }
        })
        .catch((err) => {
          modalStore.toggleModal(
            'error',
            err.message ? err.message : undefined,
          );
        })
        .finally(() => {
          loadingStore.hide();
        });
    }
  }

  // TODO: Move to API layer
  const fetchTodaysOrders = async (orderPlacedDate) => {
    return axios.get(
      API_GET_TODAYS_ORDERS + orderPlacedDate,
      userStore.getHeaderAuth(),
    );
  };

  const validateOrders = async () => {
    loadingStore.show();
    // TODO: Move this to API layer
    axios
      .get(
        API_VALIDATE_PICK_PACK_ORDERS + selectedDate,
        userStore.getHeaderAuth(),
      )
      .then((res) => {
        const {
          data: { incompleteOrders },
        } = res;

        if (incompleteOrders && incompleteOrders.length) {
          const numIncompleteOrders = incompleteOrders.length;
          modalStore.toggleModal(
            'error',
            `${numIncompleteOrders} orders still need to be packed`,
          );
          setIncompleteOrders(incompleteOrders);
        } else {
          setOrdersWereValidated(true);
          modalStore.toggleModal(
            'success',
            'Todays were completed successfully!',
          );
        }
      })
      .catch((err) => {
        modalStore.toggleModal('error', err.message ? err.message : undefined);
      })
      .finally(() => {
        loadingStore.hide();
      });
  };

  const isIncompleteOrder = (orderId) => {
    const incompleteOrder = incompleteOrders.find((o) => o._id === orderId);
    if (incompleteOrder) return true;
    return false;
  };

  const handleSelectOrderDate = (date) => {
    // Convert back to UTC from local string.
    const selectedDate = subtractUTCOffset(date);
    pickPack.setSelectedDate(selectedDate);
    loadingStore.show();
    fetchTodaysOrders(selectedDate)
      .then((res) => {
        const {
          data: { ordersAndLabels },
        } = res;

        setOrdersAndLabels(ordersAndLabels);
      })
      .catch((err) => {
        modalStore.toggleModal('error', err.message ? err.message : undefined);
      })
      .finally(() => loadingStore.hide());
  };

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h1"
        align="center"
        gutterBottom
        style={{ marginTop: '0.75em' }}
      >
        Pick/Pack Orders
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Grid container direction="column">
            <Grid item xs={12}>
              <br />
              <Typography variant="h2" gutterBottom>
                Sort & Filter
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <br />
            </Grid>
            <Typography variant="body1">Filter By Date</Typography>
            <DatePicker
              selected={addUTCOffset(selectedDate)}
              onSelect={handleSelectOrderDate}
              maxDate={moment().toDate()}
              customInput={<SelectButton />}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Grid container>
            {ordersAndLabels.length ? (
              ordersAndLabels.sort(sortOrders).map((orderDetails) => {
                return (
                  <Grid
                    key={orderDetails.orderId}
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                  >
                    <OrderCard
                      orderDetails={orderDetails}
                      isIncomplete={isIncompleteOrder(orderDetails.orderId)}
                    />
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography variant="h2" align="center">
                  No orders were received on this day.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      {(isOpsLead || isAdmin) && ordersAndLabels.length ? (
        <Grid container justify="center">
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={validateOrders}
              disabled={ordersWereValidated}
              style={{
                margin: '1rem 0',
                borderRadius: '50px',
                color: ordersWereValidated ? '#a6a6a6' : '#07004D',
              }}
            >
              <Typography variant="body1">Validate Orders</Typography>
            </Button>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
}

export default observer(PickPackPortal);

function SelectButton({ value, onClick }) {
  return (
    <PrimaryWallyButton onClick={onClick}>
      <Typography variant="body1">{value}</Typography>
    </PrimaryWallyButton>
  );
}

/**
 * Convert ISO formatted date string to local JS Date object
 * @param {String} isoDate
 */
function addUTCOffset(isoDate) {
  const selectedDateUTCOffset = moment(isoDate).utcOffset();
  let selectedDate;
  if (selectedDateUTCOffset < 0) {
    selectedDate = moment(isoDate)
      .add(-selectedDateUTCOffset, 'minutes')
      .toDate();
  } else {
    selectedDate = moment(isoDate)
      .subtract(selectedDateUTCOffset, 'minutes')
      .toDate();
  }
  return selectedDate;
}

/**
 * Subtract UTC offset from date to convert from local Date to UTC date
 * @param {Date} date
 */
function subtractUTCOffset(date) {
  const selectedDateUTCOffset = moment(date).utcOffset();
  let selectedDate;
  if (selectedDateUTCOffset < 0) {
    selectedDate = moment(date)
      .subtract(-selectedDateUTCOffset, 'minutes')
      .toDate();
  } else {
    selectedDate = moment(date).add(selectedDateUTCOffset, 'minutes').toDate();
  }
  return selectedDate;
}
