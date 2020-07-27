import React, { Component } from 'react'
import axios from 'axios';

// Components
import { Paper, Grid } from '@material-ui/core';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';

// API endpoints
import {
  API_GET_ORDER_FULFILLMENT_DETAILS,
  API_UPDATE_ORDER_FULFILLMENT_DETAILS,
  API_VERIFY_ORDER_FULFILLMENT,
} from 'config';

import InputShippingTote from './InputShippingTote'
import InputItem from './InputItem'

// CSS
import styles from './OrderFulfillmentPage.module.css';

class OrderFulfillment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fulfillmentOrder: {
        id: 'ABC3',
        order_id: 'ABC3',
        shipping_totes: [{
          packaging_url: 'url_1',
        },{
          packaging_url: 'https://thewallyshop.co/packaging/ABSCJO',
        }],
        items: [{
          name: 'Item#1',
          warehouse_location: {
            shelf: 'SHELF_LOC',
            row: 'ROW_LOC'
          },
          upc_code: 'UPC Code',
          was_upc_verified: true,
          customer_quantity: 4,
          packaging_urls: [
            'url_2',
            'url_3',
            'https://thewallyshop.co/packaging/ABSCJO',
            'url_5',
          ],
        }],
        status: 'complete',
      }
    }
  }


  async componentDidMount(){
    const {orderId} = this.props.match.params;
    const url = `${API_GET_ORDER_FULFILLMENT_DETAILS}${orderId}`;
    const res = await axios.get(url);
    this.setState({ fulfillmentOrder: res.data.orderFulfillmentDetails });
  }

  render() {
    const {orderId} = this.props.match.params;
    return (
      <Grid container justify='center'>
        <Grid item xs={12}>
          <h1 className={styles.title}>
            Order {orderId}
          </h1>
        </Grid>
        <Grid item xs={12}>
          <OrderFulfillmentForm
            shipping_totes={this.state.fulfillmentOrder.shipping_totes}
            items={this.state.fulfillmentOrder.items}
            status={this.state.fulfillmentOrder.status}
          />
        </Grid>
      </Grid>
    )
  }
}

export default OrderFulfillment;

function OrderFulfillmentForm({
  shipping_totes,
  items,
  status,
}) {
  return (
    <div className={styles.formWrapper}>
      <Formik
        initialValues={{
          shipping_totes: shipping_totes,
          items: items,
          status: status,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            {shipping_totes.map((_, idx) => (
              <Field
                key={idx}
                name={`shipping_totes.${idx}.packaging_url`}
                component={InputShippingTote}
                onScan={setFieldValue}
                fieldIndex={idx}
              />
            ))}
            {items.map((_, idx) => (
              <Field
                key={idx}
                name={`items.${idx}`}
                component={InputItem}
                onScan={setFieldValue}
                fieldIndex={idx}
              />
            ))}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
