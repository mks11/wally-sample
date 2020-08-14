import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
      text = 'Pending Quality Assurance';
      break;
    default:
      className = styles.received;
      text = 'Not Started';
      break;
  }

  return (
    <Typography variant="body1" className={className}>
      {text}
    </Typography>
  );
}

const CardHeaderWrapper = styled(Grid)`
  ${'' /* padding: 1rem;
  background-color: #97adff; */}
`;

const CardHeaderLink = styled(Link)`
  padding: 1rem;
  background-color: #97adff;
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
  padding-top: 0;
  background-color: #97adff;
`;

function CardHeader({ orderId, status }) {
  return (
    <>
      <CardHeaderWrapper container alignItems="center" justify="center">
        <CardHeaderLink to={`/order-fulfillment/${orderId}`}>
          <CardHeaderLinkText variant="h4" component="span">
            Order {orderId}
          </CardHeaderLinkText>
        </CardHeaderLink>
      </CardHeaderWrapper>
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
          <a href={orderLabel} alt="Order Label">
            <Typography variant="body2">Order Label</Typography>
          </a>
        </Grid>
        <Grid item className={styles.labelLink}>
          <a href={returnLabel} alt="Return Label">
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

    this.state = {
      ordersAndLabels: [],
      highlightedOrders: [],
    };

    this.modalStore = props.store.modal;
    this.userStore = props.store.user;
    this.loadingStore = props.store.loading;
  }

  componentDidMount() {
    this.loadingStore.toggle();
    this.fetchTodaysOrders().then(() => {
      this.loadingStore.toggle();
    });
  }

  fetchTodaysOrders = async () => {
    const url = API_GET_TODAYS_ORDERS;
    const res = await axios.get(url);
    const { ordersAndLabels } = res.data;
    this.setState({ ordersAndLabels });
  };

  validateOrders = async () => {
    const url = API_VALIDATE_PICK_PACK_ORDERS;
    const res = await axios.get(url);
    const { incompleteOrders } = res.data;

    if (incompleteOrders.length) {
      this.modalStore.toggleModal(
        'error',
        'Some orders still need to be packed',
      );
      this.setState({ highlightedOrders: incompleteOrders });
    } else {
      this.setState({ showValidateOrders: false });
    }
  };

  isHighlightedOrder = (orderId) => {
    return !!this.state.highlightedOrders.find((o) => o.orderId === orderId);
  };

  render() {
    const { isOpsLead } = this.userStore;

    return (
      <Container maxWidth="lg" disableGutters>
        <Typography variant="h1" align="center" gutterBottom>
          Pick/Pack Orders
        </Typography>
        <Grid container justify="flex-start">
          {this.state.ordersAndLabels.sort(sortOrders).map((orderDetails) => {
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
          })}
        </Grid>
        {isOpsLead ? (
          <div className={styles.validateContainer}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.validateOrders}
            >
              Validate Orders
            </Button>
          </div>
        ) : null}
      </Container>
    );
  }
}

export default connect('store')(PickPackPortal);
