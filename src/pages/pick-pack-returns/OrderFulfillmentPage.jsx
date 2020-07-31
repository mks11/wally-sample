import React, { Component } from 'react';
import axios from 'axios';

// Components
import { Button, Grid } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';

// API endpoints
import {
  API_GET_ORDER_FULFILLMENT_DETAILS,
  API_UPDATE_ORDER_FULFILLMENT_DETAILS,
  API_VERIFY_ORDER_FULFILLMENT,
} from 'config';
import { connect } from 'utils';

import InputShippingTote from './InputShippingTote';
import InputItem from './InputItem';

// CSS
import styles from './OrderFulfillmentPage.module.css';

function OrderFulfillmentForm({
  fulfillmentOrder,
  isWarehouseAssociate,
  userId,
  onSubmit,
}) {
  console.log(fulfillmentOrder);
  const { shipping_totes = [], items = [] } = fulfillmentOrder;

  return (
    <div className={styles.formWrapper}>
      <Formik
        initialValues={{
          shipping_totes: shipping_totes,
          items: items,
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit();

          const requestUrl = isWarehouseAssociate
            ? `${API_UPDATE_ORDER_FULFILLMENT_DETAILS}${fulfillmentOrder._id}`
            : `${API_VERIFY_ORDER_FULFILLMENT}${fulfillmentOrder._id}`;

          axios
            .patch(requestUrl, {
              orderFulfillmentDetails: {
                ...fulfillmentOrder,
                ...values,
                ...(isWarehouseAssociate
                  ? { warehouse_associate_id: userId }
                  : { shift_lead_id: userId }),
              },
            })
            .then((res) => {
              // all good
            })
            .finally(() => {
              setSubmitting(false);
            });
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
            <Button
              className={styles.submitBtn}
              type="submit"
              disabled={isSubmitting}
              variant="contained"
            >
              {isWarehouseAssociate ? 'Fulfill Order' : 'Verify Order'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

class OrderFulfillment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fulfillmentOrder: {},
      //   fulfillmentOrder: {
      //     _id: 'ABC3',
      //     order_id: 'ABC3',
      //     shipping_totes: [
      //       {
      //         packaging_url: 'url_1',
      //       },
      //       {
      //         packaging_url: 'https://thewallyshop.co/packaging/ABSCJO',
      //       },
      //     ],
      //     items: [
      //       {
      //         name: 'Item#1',
      //         warehouse_location: {
      //           shelf: 'SHELF_LOC',
      //           row: 'ROW_LOC',
      //         },
      //         upc_code: 'UPC Code',
      //         was_upc_verified: true,
      //         customer_quantity: 4,
      //         packaging_urls: [
      //           'url_2',
      //           'url_3',
      //           'https://thewallyshop.co/packaging/ABSCJO',
      //           'url_5',
      //         ],
      //       },
      //     ],
      //     status: 'complete',
      //   },
      //   isWarehouseAssociate: true,
      //   userId: '',
    };

    this.userStore = props.store.user;
    this.routing = props.store.routing;
  }

  componentDidMount() {
    this.userStore
      .getStatus(true)
      .then((status) => {
        if (!status || this.userStore.isUser()) {
          this.routing.push('/');
        } else {
          this.setState({
            userId: this.userStore.user._id,
            isWarehouseAssociate: this.userStore.isOps(),
          });
          this.fetchOrder();
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/');
      });
  }

  fetchOrder = async () => {
    const { orderId } = this.props.match.params;
    const url = `${API_GET_ORDER_FULFILLMENT_DETAILS}${orderId}`;
    const res = await axios.get(url);
    this.setState({ fulfillmentOrder: res.data.orderFulfillmentDetails });
  };

  handleSubmit = () => {
    this.setState({
      fulfillmentOrder: {
        ...this.state.fulfillmentOrder,
        status: this.state.isWarehouseAssociate
          ? 'pending_quality_assurance'
          : 'packaged',
      },
    });
  };

  render() {
    const { orderId } = this.props.match.params;
    return (
      <Grid container justify="center">
        <Grid item xs={12}>
          <h1 className={styles.title}>Order {orderId}</h1>
        </Grid>
        <Grid item xs={12}>
          <OrderFulfillmentForm
            fulfillmentOrder={this.state.fulfillmentOrder}
            isWarehouseAssociate={this.state.isWarehouseAssociate}
            userId={this.state.userId}
            onSubmit={this.handleSubmit}
          />
        </Grid>
      </Grid>
    );
  }
}

export default connect('store')(OrderFulfillment);
