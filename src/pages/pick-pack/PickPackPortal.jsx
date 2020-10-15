import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Divider,
  Typography,
} from '@material-ui/core';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import DatePicker from 'react-datepicker';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Cancel from '@material-ui/icons/Cancel';
import styled from 'styled-components';

import { connect } from 'utils';
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

function OrderCard({ orderDetails, highlight = false }) {
  const { name, orderId, inboundLabel, outboundLabel, status } = orderDetails;

  return (
    <Card className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
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

class PickPackPortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersAndLabels: [],
      highlightedOrders: [],
    };

    this.modalStore = props.store.modal;
    this.userStore = props.store.user;
    this.loadingStore = props.store.loading;
    // Unpack selected order date to pass through fetchTodaysOrders
    this.selectedDate = props.store.pickPack.selectedDate;
    this.setSelectedDate = props.store.pickPack.setSelectedDate;
  }

  componentDidMount() {
    this.loadingStore.toggle();
    this.fetchTodaysOrders(this.selectedDate)
      .then((res) => {
        const {
          data: { ordersAndLabels },
        } = res;

        if (ordersAndLabels.length) {
          this.setState({ ordersAndLabels });
        }
      })
      .catch((err) => {
        this.modalStore.toggleModal(
          'error',
          err.message ? err.message : undefined,
        );
      })
      .finally(() => {
        setTimeout(() => this.loadingStore.toggle(), 300);
      });
  }

  fetchTodaysOrders = async (orderPlacedDate) => {
    return axios.get(
      API_GET_TODAYS_ORDERS + orderPlacedDate,
      this.userStore.getHeaderAuth(),
    );
  };

  validateOrders = async () => {
    this.loadingStore.toggle();
    axios
      .get(
        API_VALIDATE_PICK_PACK_ORDERS + this.selectedDate,
        this.userStore.getHeaderAuth(),
      )
      .then((res) => {
        const {
          data: { incompleteOrders },
        } = res;

        if (incompleteOrders && incompleteOrders.length) {
          const numIncompleteOrders = incompleteOrders.length;
          this.modalStore.toggleModal(
            'error',
            `${numIncompleteOrders} orders still need to be packed`,
          );
          this.setState({ highlightedOrders: incompleteOrders });
        } else {
          this.setState({
            showValidateOrders: false,
          });

          this.modalStore.toggleModal(
            'success',
            'Todays were completed successfully!',
          );
        }
      })
      .catch((err) => {
        this.modalStore.toggleModal(
          'error',
          err.message ? err.message : undefined,
        );
      })
      .finally(() => {
        setTimeout(() => this.loadingStore.toggle(), 300);
      });
  };

  isHighlightedOrder = (orderId) => {
    return !!this.state.highlightedOrders.find((o) => o.orderId === orderId);
  };

  handleSelectOrderDate = (date) => {
    // Convert back to UTC from local string.
    const selectedDate = subtractUTCOffset(date);
    this.setSelectedDate(selectedDate);
    this.loadingStore.toggle();
    this.fetchTodaysOrders(this.selectedDate)
      .then((res) => {
        const {
          data: { ordersAndLabels },
        } = res;

        if (ordersAndLabels.length) {
          this.setState({ ordersAndLabels });
        }
      })
      .catch((err) => {
        this.modalStore.toggleModal(
          'error',
          err.message ? err.message : undefined,
        );
      })
      .finally(() => {
        setTimeout(() => this.loadingStore.toggle(), 300);
      });
  };

  render() {
    const { isOpsLead, isAdmin } = this.userStore;
    const { ordersAndLabels, ordersWereValidated } = this.state;
    const selectedDate = addUTCOffset(this.selectedDate);

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
                selected={selectedDate}
                onSelect={this.handleSelectOrderDate}
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
                        highlight={this.isHighlightedOrder(
                          orderDetails.orderId,
                        )}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h2" align="center">
                    No orders have been received today.
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
                onClick={this.validateOrders}
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
}

export default connect('store')(PickPackPortal);

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
