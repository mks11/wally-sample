import React, { Component } from 'react'
import axios from 'axios';

// Components
import {Grid} from '@material-ui/core';
import {Formik, Form, Field, ErrorMessage} from 'formik';

// API endpoints
import {API_GET_ORDER_FULFILLMENT_DETAILS, API_UPDATE_ORDER_FULFILLMENT_DETAILS, API_VERIFY_ORDER_FULFILLMENT} from '../../config';

// CSS
import styles from './OrderFulfillmentPage.module.css';

class OrderFulfillment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      order_id: '',
      shipping_totes: [],
      items: [],
      status: ''
    }
  }


  async componentDidMount(){
    const {orderId} = this.props.match.params;
    const url = `${API_GET_ORDER_FULFILLMENT_DETAILS}${orderId}`;
    const res = await axios.get(url);
    const {id, items, order_id, shipping_totes, status} = res.data.orderFulfillmentDetails;
    this.setState({id, items, order_id, shipping_totes, status});
  }

  render() {
    const {orderId} = this.props.match.params;
    return (
      <Grid container  justify='center'>
        <h1 className={styles.title}>
          Order {orderId}
        </h1>
      </Grid>
    )
  }
}

export default OrderFulfillment;

class OrderFulfillmentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {

    return (
      <Formik
        // initialValues=
      >

      </Formik>
    )
  }
}
