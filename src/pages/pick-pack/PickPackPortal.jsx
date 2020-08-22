import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Cancel from '@material-ui/icons/Cancel';
import styled from 'styled-components';

import { connect } from 'utils';
import { getEndOfDay } from 'services/date';
import { API_GET_TODAYS_ORDERS, API_VALIDATE_PICK_PACK_ORDERS } from 'config';

// Styles
import styles from './PickPackTab.module.css';

function StatusIcon({ status }) {
  let className;
  let Icon;

  switch (status) {
    case 'packaged':
      Icon = CheckCircle;
      className = styles.complete;
      break;
    case 'pending_quality_assurance':
      Icon = Error;
      className = styles.pendingQA;
      break;
    default:
      Icon = Cancel;
      className = styles.received;
      break;
  }

  return <Icon className={className} />;
}

function StatusText({ status }) {
  let className;
  let text;

  switch (status) {
    case 'packaged':
      className = styles.complete;
      text = 'Complete';
      break;
    case 'pending_quality_assurance':
      className = styles.pendingQA;
      text = 'Pending Q/A';
      break;
    default:
      className = styles.received;
      text = 'Not Started';
      break;
  }

  return (
    <Typography variant="body1" className={className} align="center">
      {text}
    </Typography>
  );
}

const CardHeaderLink = styled(Link)`
  padding: 1rem;
  background-color: #2d82b7;
  width: 100%;
  text-decoration: none;
`;

const CardHeaderLinkText = styled(Typography)`
  display: inline-block;
  width: 100%;
  text-align: center;
  color: #fff;
`;

const StatusTextWrapper = styled(Grid)`
  padding: 1rem;
`;

function CardHeader({ orderId, status }) {
  return (
    <>
      <Grid container alignItems="center" justify="center">
        <CardHeaderLink to={`/pick-pack/${orderId}`}>
          <CardHeaderLinkText variant="h4" component="span">
            Order {orderId}
          </CardHeaderLinkText>
        </CardHeaderLink>
      </Grid>
      <StatusTextWrapper
        container
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <StatusText status={status} />
        </Grid>

        <Grid item>
          <StatusIcon status={status} />
        </Grid>
      </StatusTextWrapper>
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
  const { orderId, inboundLabel, outboundLabel, status } = orderDetails;

  return (
    <Card className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
      <CardHeader orderId={orderId} status={status} />
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
    const { cookies } = props;
    this.state = {
      ordersAndLabels: [],
      highlightedOrders: [],
      ordersWereValidated: cookies.get('ordersWereValidated') || false,
    };

    this.modalStore = props.store.modal;
    this.userStore = props.store.user;
    this.loadingStore = props.store.loading;
    this.cookies = cookies;
  }

  componentDidMount() {
    this.loadingStore.toggle();
    this.fetchTodaysOrders()
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

  fetchTodaysOrders = async () => {
    return axios.get(API_GET_TODAYS_ORDERS, this.userStore.getHeaderAuth());
  };

  validateOrders = async () => {
    this.loadingStore.toggle();
    axios
      .get(API_VALIDATE_PICK_PACK_ORDERS, this.userStore.getHeaderAuth())
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
          this.cookies.set('ordersWereValidated', true, {
            expires: getEndOfDay(),
          });

          this.setState({
            showValidateOrders: false,
            ordersWereValidated: true,
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

  render() {
    const { isOpsLead } = this.userStore;
    const { ordersAndLabels, ordersWereValidated } = this.state;

    return (
      <Container maxWidth="lg">
        <Typography variant="h1" align="center" gutterBottom>
          Pick/Pack Orders
        </Typography>
        <Grid container justify="flex-start">
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
                  xl={4}
                >
                  <OrderCard
                    orderDetails={orderDetails}
                    highlight={this.isHighlightedOrder(orderDetails.orderId)}
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
        {isOpsLead && ordersAndLabels.length && (
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
        )}
      </Container>
    );
  }
}

export default withCookies(connect('store')(PickPackPortal));
