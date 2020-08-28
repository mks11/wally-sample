import React, { Component, useState } from 'react';
import axios from 'axios';

// Components
import {
  Button,
  Container,
  Grid,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
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
    this.routerStore = props.store.routing;
  }

  componentDidMount() {
    const url = `${API_GET_ORDER_FULFILLMENT_DETAILS}${this.orderId}`;
    this.loadingStore.toggle();
    axios
      .get(url, this.userStore.getHeaderAuth())
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
      <Container maxWidth="sm">
        <Grid container justify="center">
          <Grid item xs={12}>
            <Typography variant="h1" align="center" gutterBottom>
              Order {this.orderId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {this.state.orderFulfillment ? (
              <OrderFulfillmentForm
                {...this.state}
                userStore={this.userStore}
                loadingStore={this.loadingStore}
                modalStore={this.modalStore}
                routerStore={this.routerStore}
              />
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
  loadingStore,
  modalStore,
  userStore,
  routerStore,
}) {
  const { order_id, shipping_totes, items, status } = orderFulfillment;
  const [orderWasFulfilled, setOrderWasFulfilled] = useState(
    status === 'pending_quality_assurance' || false,
  );
  const [orderWasVerified, setOrderWasVerified] = useState(
    status === 'packaged' || false,
  );
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const openSnackbar = (message, severity) => {
    setIsSnackbarOpen(true);
    setSnackbarText(message);
    setSnackbarSeverity(severity);
  };

  const closeSnackbar = () => setIsSnackbarOpen(false);

  return (
    <>
      <Formik
        initialValues={{
          shipping_totes,
          items,
        }}
        //TODO REFACTOR INTO SEPARATE FUNCTION FOR CLARITY
        onSubmit={(values, { setSubmitting }) => {
          const url = getOnSubmitEndpoint(
            isWarehouseAssociate,
            orderFulfillment.id,
          );
          loadingStore.toggle();
          axios
            .patch(
              url,
              {
                orderFulfillmentDetails: {
                  ...orderFulfillment,
                  ...values,
                  ...(isWarehouseAssociate
                    ? { warehouse_associate_id: userId }
                    : { shift_lead_id: userId }),
                  status: isWarehouseAssociate
                    ? 'pending_quality_assurance'
                    : 'packaged',
                },
              },
              userStore.getHeaderAuth(),
            )
            .then((res) => {
              if (res.status === 200) {
                openSnackbar(
                  `Order ${order_id} was fulfilled successfully!`,
                  'success',
                );
                if (!isWarehouseAssociate) {
                  setOrderWasVerified(true);
                } else {
                  setOrderWasFulfilled(true);
                }
              }
            })
            .catch((err) => {
              openSnackbar(
                err.message ||
                  'Oops, an error occured during order fulfillment!',
                'error',
              );
            })
            .finally(() => {
              setSubmitting(false);
              setTimeout(() => {
                loadingStore.toggle();
              }, 300);

              if (orderWasFulfilled) {
                setTimeout(() => routerStore.push('/pick-pack'), 1800);
              }
            });
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {values.shipping_totes &&
              values.shipping_totes.length &&
              values.shipping_totes.map((_, idx) => (
                <Field
                  key={`tote-${idx}`}
                  name={`shipping_totes.${idx}.packaging_url`}
                  component={InputShippingTote}
                  onScan={setFieldValue}
                  fieldIndex={idx}
                  modalStore={modalStore}
                />
              ))}
            {values.items &&
              values.items.length &&
              values.items.map((_, idx) => (
                <Field
                  key={`item-${idx}`}
                  name={`items.${idx}`}
                  component={InputItem}
                  fieldIndex={idx}
                  modalStore={modalStore}
                />
              ))}
            <Grid container justify="center" alignItems="center" spacing={4}>
              <Grid item>
                <Button
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting || orderWasVerified}
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={1500}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
}

function getOnSubmitEndpoint(isWarehouseAssociate, orderFulfillmentId) {
  return isWarehouseAssociate
    ? `${API_UPDATE_ORDER_FULFILLMENT_DETAILS}${orderFulfillmentId}`
    : `${API_VERIFY_ORDER_FULFILLMENT}${orderFulfillmentId}`;
}
