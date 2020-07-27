import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Cancel from '@material-ui/icons/Cancel';

import { connect } from 'utils'
import {
  API_GET_TODAYS_ORDERS,
  API_VALIDATE_PICK_PACK_ORDERS,
} from 'config';

// Styles
import styles from './PickPackTab.module.css';

function StatusIcon({ status }) {
  let color;
  let text;
  let Icon;

  switch(status) {
    case 'packaged':
      Icon = CheckCircle;
      color = 'green';
      text = 'Complete';
      break;
    case 'pending_quality_assurance':
      Icon = Error;
      color = 'yellow';
      text = 'Pending Quality Assurance';
      break;
    default:
      Icon = Cancel;
      color = 'red';
      text = 'Received';
      break;
  }

  return (
  <Grid container direction='column' alignItems='center'>
    <Icon style={{color}} />
    <Typography
      variant='body1'
      style={{ color }}
    >
      {text}
    </Typography>
  </Grid>
  )
}

function CardHeader({ orderId, status }) {
  return (
    <Grid
      alignItems="center"
      className={styles.cardHeader}
      container
      justify="space-evenly"
    >
      <Grid
        className={styles.subTitle}
        component="h3"
        item
      >
        <Link to={`/pick-pack-returns/order-fulfillment/${orderId}`}>
          Order {orderId}
        </Link>
      </Grid>
      <Grid item>
        <StatusIcon status={status}/>
      </Grid>
    </Grid>
  )
}

function OrderCardContent({ orderLabel, returnLabel }) {
  return (
    <CardContent className={styles.cardContent}>
      <Grid
        container
        justify='space-evenly'
        alignItems='center'
      >
        <Grid item className={styles.labelLink}>
          <a href={orderLabel} alt="Order Label" >
            Order Label
          </a>
        </Grid>
        <Grid item className={styles.labelLink}>
          <a href={returnLabel} alt="Return Label" >
            Return Label
          </a>
        </Grid>
      </Grid>
    </CardContent>
  )
}

function OrderCard({ orderDetails, highlight = false }) {
  const {
    orderId,
    inboundLabel,
    outboundLabel,
    status,
  } = orderDetails;

  return (
    <Card className={`${styles.card} ${ highlight ? styles.highlight : ''}`}>
      <CardHeader orderId={orderId} status={status} />
      <OrderCardContent returnLabel={inboundLabel} orderLabel={outboundLabel} />
    </Card>
  )
}

function sortOrders(a, b) {
  // Sort from received -> pending_quality_assurance -> packaged
  const aStatus = a.status;
  const bStatus = b.status;

  return aStatus < bStatus
    ? 1
    : (aStatus > bStatus ? -1 : 0)
}

class PickPackTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ordersAndLabels: [{
        orderId: 'ABC1',
        inboundLabel: `some_link_to_inbound_label.pdf`,
        outboundLabel: `some_link_to_outbound_label.pdf`,
        status: 'packaged',
      }, {
        orderId: 'ABC2',
        inboundLabel: `some_link_to_inbound_label.pdf`,
        outboundLabel: `some_link_to_outbound_label.pdf`,
        status: 'pending_quality_assurance',
      }, {
        orderId: 'ABC3',
        inboundLabel: `some_link_to_inbound_label.pdf`,
        outboundLabel: `some_link_to_outbound_label.pdf`,
        status: 'status',
      }],
      highlightedOrders: [],
      showValidateOrders: false,
    }

    this.modalStore = props.store.modal
  }

  componentDidMount() {
    this.fetchTodaysOrders()
  }

  fetchTodaysOrders = async () => {
    const url = API_GET_TODAYS_ORDERS;
    const res = await axios.get(url);
    const { ordersAndLabels } = res.data;

    this.setState({ ordersAndLabels })
  }

  validateOrders = async () => {
    const url = API_VALIDATE_PICK_PACK_ORDERS;
    const res = await axios.get(url);
    const { unpackedOrders } = res.data;

    if (unpackedOrders.length) {
      this.modalStore.toggleModal('error', 'Some orders are not valid')
      this.setState({ highlightedOrders: unpackedOrders });
    } else {
      this.setState({ showValidateOrders: false });
    }
  }

  isHighlightedOrder = (orderId) => {
    return !!this.state.highlightedOrders.find(o => o.orderId === orderId)
  }

  render() {
    return (
      <div>
        <h2 className={styles.title}>Pick/Pack Orders</h2>
        {
          this.state.ordersAndLabels
          .sort(sortOrders)
          .map(orderDetails => {
            return (
              <OrderCard
                key={orderDetails.orderId}
                orderDetails={orderDetails}
                highlight={this.isHighlightedOrder(orderDetails.orderId)}
              />
            )
          })
        }
        {this.state.showValidateOrders ? (
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
      </div>
    )
  }
}

export default connect("store")(PickPackTab);
