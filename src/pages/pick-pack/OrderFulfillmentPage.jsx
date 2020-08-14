import React, { Component } from 'react';
import axios from 'axios';

// Components
import { Button, Container, Grid, Typography } from '@material-ui/core';
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

function OrderFulfillmentForm({
  fulfillmentOrder,
  isWarehouseAssociate,
  userId,
  onSubmit,
}) {
  if (!fulfillmentOrder) return null;

  const { shipping_totes = [], items = [] } = fulfillmentOrder;

  return (
    <Formik
      initialValues={{
        shipping_totes: shipping_totes,
        items: items,
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit();

        const requestUrl = isWarehouseAssociate
          ? `${API_UPDATE_ORDER_FULFILLMENT_DETAILS}${fulfillmentOrder.id}`
          : `${API_VERIFY_ORDER_FULFILLMENT}${fulfillmentOrder.id}`;

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
          <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item>
              <Button
                color="secondary"
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                style={{
                  margin: '1rem 0',
                  color: '#fff',
                  borderRadius: '50px',
                }}
              >
                <Typography variant="body1">
                  {isWarehouseAssociate ? 'Fulfill Order' : 'Verify Order'}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

class OrderFulfillment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fulfillmentOrder: undefined,
    };

    this.userStore = props.store.user;
    this.routing = props.store.routing;
  }

  componentDidMount() {
    this.userStore
      .getStatus(true)
      .then(() => {
        this.setState({
          userId: this.userStore.user._id,
          isWarehouseAssociate: this.userStore.isOps,
        });
        this.fetchOrder();
      })
      .catch((error) => {
        console.error(error);
        this.routing.push('/');
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
      <Container maxWidth="md">
        <Grid container justify="center">
          <Grid item xs={12}>
            <Typography variant="h1" align="center" gutterBottom>
              Order {orderId}
            </Typography>
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
      </Container>
    );
  }
}

export default connect('store')(OrderFulfillment);
