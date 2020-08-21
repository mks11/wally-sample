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

class OrderFulfillment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarehouseAssociate: false,
      orderFulfillment: undefined,
      userId: '',
    };

    const { orderId } = props.match.params;

    this.orderId = orderId;
    this.loadingStore = props.store.loading;
    this.modalStore = props.store.modal;
    this.userStore = props.store.user;
  }

  componentDidMount() {
    const url = `${API_GET_ORDER_FULFILLMENT_DETAILS}${this.orderId}`;
    this.loadingStore.toggle();
    axios
      .get(url)
      .then((res) => {
        const {
          data: { orderFulfillmentDetails },
        } = res;

        this.setState({
          isWarehouseAssociate: this.userStore.isOps,
          orderFulfillment: orderFulfillmentDetails,
          userId: this.userStore.userId,
        });
      })
      .catch((err) => {
        console.error(err);
        const { message } = err;
        if (message) {
          this.modalStore.toggleModal('error', message);
        } else {
          this.modalStore.toggleModal('error');
        }
      })
      .finally(() => setTimeout(() => this.loadingStore.toggle(), 300));
  }

  render() {
    return (
      <Container maxWidth="md">
        <Grid container justify="center">
          <Grid item xs={12}>
            <Typography variant="h1" align="center" gutterBottom>
              Order {this.orderId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.orderFulfillment ? (
              <OrderFulfillmentForm {...this.state} />
            ) : null}
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default connect('store')(OrderFulfillment);

function OrderFulfillmentForm({
  isWarehouseAssociate,
  orderFulfillment,
  userId,
}) {
  // TODO REMOVE WHEN FINISHED DEBUGGING
  console.log(isWarehouseAssociate, orderFulfillment, userId);
  const { shipping_totes, items } = orderFulfillment;

  return (
    <Formik
      initialValues={{
        shipping_totes,
        items,
      }}
      //TODO REFACTOR INTO SEPARATE FUNCTION FOR CLARITY
      // onSubmit={(values, { setSubmitting }) => {
      //   const url = getOnSubmitEndpoint(isWarehouseAssociate, orderFulfillment.id);
      //   axios
      //     .patch(url, {
      //       orderFulfillmentDetails: {
      //         ...orderFulfillment,
      //         ...values,
      //         ...(isWarehouseAssociate
      //           ? { warehouse_associate_id: userId }
      //           : { shift_lead_id: userId }),
      //       },
      //     })
      //     .then((res) => {
      //       // all good
      //     })
      //     .finally(() => {
      //       setSubmitting(false);
      //     });
      // }}
      onSubmit={() => alert('foo')}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          {shipping_totes.map((_, idx) => (
            <Field
              key={`tote-${idx}`}
              name={`shipping_totes.${idx}.packaging_url`}
              component={InputShippingTote}
              onScan={setFieldValue}
              fieldIndex={idx}
            />
          ))}
          {items.map((_, idx) => (
            <Field
              key={`item-${idx}`}
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

function getOnSubmitEndpoint(isWarehouseAssociate, orderFulfillmentId) {
  return isWarehouseAssociate
    ? `${API_UPDATE_ORDER_FULFILLMENT_DETAILS}${orderFulfillmentId}`
    : `${API_VERIFY_ORDER_FULFILLMENT}${orderFulfillmentId}`;
}
