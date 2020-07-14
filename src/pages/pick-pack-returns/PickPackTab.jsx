import React, { Component } from 'react';
import axios from 'axios';
import {Card, CardContent, Grid, Typography} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Cancel from '@material-ui/icons/Cancel';
import {API_GET_TODAYS_ORDERS} from '../../config';
import {Link} from 'react-router-dom';

// Styles
import styles from './PickPackTab.module.css';

class PickPackTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ordersAndLabels: [],
    }
  }

  async componentDidMount(){
    const url = API_GET_TODAYS_ORDERS;
    const res = await axios.get(url);
    const {ordersAndLabels} = res.data;
    this.setState({ordersAndLabels})
    console.log(ordersAndLabels)
  }

  render() {
    return (
      <div>
        <h2 className={styles.title}>
          Pick/Pack Orders
        </h2>
        {
          this.state.ordersAndLabels
          .sort((a, b) => {
            // Sort from received -> pending_quality_assurance -> packaged
            const aStatus = a.status;
            const bStatus = b.status;

            if (aStatus < bStatus) return 1;
            else if (aStatus > bStatus) return -1;
            else return 0;
          })
          .map((orderDetails) => {
            return <OrderCard key={orderDetails.orderId} orderDetails={orderDetails} />
          })
        }
      </div>
    )
  }
}

class OrderCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {orderId, inboundLabel, outboundLabel, status} = this.props.orderDetails;

    return (
      <Card className={styles.card}>
        <CardHeader orderId={orderId} status={status} />
        <Content returnLabel={inboundLabel} orderLabel={outboundLabel} />
      </Card>
    )
  }
}

class CardHeader extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    const {orderId, status} = this.props;
    return (
      <Grid container justify={'space-evenly'} alignItems={'center'} className={styles.cardHeader}>
        <Grid item component={'h3'} className={styles.subTitle}>
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
}

class Content extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const {orderLabel, returnLabel} = this.props;

    return (
      <CardContent className={styles.cardContent}>
        <Grid container justify='space-evenly' alignItems='center'>
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
}

class StatusIcon extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {status} = this.props;
    let color;
    let text;
    let Icon;

    switch(status){
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

    }

    return (
    <Grid container direction='column' alignItems='center'>
      <Icon style={{color}} />
      <Typography variant='body1' style={{color}}>{text}</Typography>
    </Grid>
    )
  }
}

export default PickPackTab;
