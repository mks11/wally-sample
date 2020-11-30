import React, { Component, lazy, Suspense } from 'react';

// MobX
import { useStores } from 'hooks/mobx';

// Utils
import { connect } from '../utils';

import { Input } from 'reactstrap';
import Title from '../common/page/Title';
import ApplyPromoCodeForm from 'forms/ApplyPromoCodeForm';

// Payment Methods
import StripeCardInput from 'common/StripeCardInput';
import { PaymentMethod } from 'common/PaymentMethods';

// Styled Components
import {
  PrimaryTextButton,
  PrimaryWallyButton,
  DangerButton,
} from 'styled-component-lib/Buttons';

// Material UI
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  Grid,
  Typography,
} from '@material-ui/core';
import { Edit, DeleteOutline } from '@material-ui/icons';
import { AddIcon } from 'Icons';

// Addresses
const AddressCreateForm = lazy(() => import('forms/Address/Create'));

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      telephone: '',
      email: '',
      editName: true,
      editTelephone: true,
    };

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.modalStore = this.props.store.modal;
    this.loading = this.props.store.loading;
    this.snackbar = this.props.store.snackbar;
  }

  componentDidMount() {
    this.userStore.getStatus(true).then((status) => {
      if (!status) {
        this.props.store.routing.push('/');
      } else {
        const user = this.userStore.user;
        this.setState({
          name: user.name,
          telephone: user.primary_telephone,
          email: user.email,
        });
      }
    });
  }

  toggleEditName(s) {
    this.setState({ editName: s });
    if (this.state.editName) {
      const $el = window.$('#inputName');
      $el.focus();
    }
  }

  toggleEditTelephone(s) {
    this.setState({ editTelephone: s });
    if (this.state.editTelephone) {
      const $el = window.$('#inputTelephone');
      $el.focus();
    }
  }

  edit() {
    this.userStore
      .edit({
        name: this.state.name,
        telephone: this.state.telephone,
      })
      .then((data) => {
        this.userStore.setUserData(data);
      })
      .catch((e) => {
        const msg = e.response.data.error.message;
        this.setState({ invalidText: msg });
        console.error('Failed to delete address', e);
      });
  }

  updateName(e) {
    this.edit();
    this.toggleEditName(true);
  }

  updateTelephone(e) {
    this.edit();
    this.toggleEditTelephone(true);
  }

  render() {
    if (!this.userStore.user) return null;

    const name = this.state.name;
    const telephone = this.state.telephone ? this.state.telephone : '';

    const addresses = this.userStore.user.addresses;
    const payments = this.userStore.user.payment.filter((p) => p.is_active);

    return (
      <div className="App">
        <Title content="Account" />

        <section className="page-section aw-account--details pt-1">
          <div className="container">
            <h2>Account Details</h2>
            <form autoComplete="off">
              <div className="aw-input--group">
                <Input
                  className="aw-input--control aw-input--control-large aw-input--left"
                  type="text"
                  readOnly={this.state.editName}
                  placeholder="Enter your name"
                  id="inputName"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
                {this.state.editName ? (
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={(e) => this.toggleEditName(false)}
                  >
                    EDIT
                  </button>
                ) : null}
                {!this.state.editName ? (
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={(e) => this.updateName(e)}
                  >
                    SAVE
                  </button>
                ) : null}
              </div>
              <div className="aw-input--group">
                <Input
                  className="aw-input--control aw-input--control-large aw-input--left"
                  type="text"
                  readOnly={this.state.editTelephone}
                  id="inputTelephone"
                  placeholder="Enter your phone number"
                  value={telephone}
                  onChange={(e) => this.setState({ telephone: e.target.value })}
                />
                {this.state.editTelephone ? (
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={(e) => this.toggleEditTelephone(false)}
                  >
                    EDIT
                  </button>
                ) : null}
                {!this.state.editTelephone ? (
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={(e) => this.updateTelephone(e)}
                  >
                    SAVE
                  </button>
                ) : null}
              </div>
              <Input
                className="aw-input--control aw-input--control-large aw-input--left"
                type="text"
                readOnly={true}
                value={this.state.email}
                placeholder="Enter your email address"
              />
            </form>
          </div>
        </section>

        <Box component="section" my={4}>
          <Container maxWidth="xl">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h2">Addresses</Typography>
              <AddNewAddress />
            </Box>
            <Divider />
            <ul className="list-addresses">
              {addresses.map((data, index) => (
                <li key={index}>
                  <Grid container justify="space-between">
                    <Grid item xs={12} lg={3}>
                      <Typography variant="h4" component="h3">
                        {data.street_address} {data.unit}, {data.state}{' '}
                        {data.zip}
                      </Typography>
                      <Typography variant="body1">{data.name}</Typography>
                      <Typography variant="body1" gutterBottom>
                        {data.telephone}
                      </Typography>
                    </Grid>
                    {data.address_id ===
                    this.userStore.user.preferred_address ? (
                      <Grid item>
                        <br />
                        <Typography variant="h5" component="span">
                          DEFAULT
                        </Typography>
                      </Grid>
                    ) : (
                      <Grid item xs={12} md={6} lg={3}>
                        <br />
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={async () => {
                            this.loading.show();
                            this.userStore
                              .makeDefaultAddress(data.address_id)
                              .then(() => {
                                setTimeout(() => {
                                  this.userStore.getUser();
                                  this.snackbar.openSnackbar(
                                    'Default address updated successfully!',
                                    'success',
                                  );
                                }, 200);
                              })
                              .finally(() => {
                                setTimeout(() => this.loading.hide(), 300);
                              });
                          }}
                        >
                          <Typography variant="body1">
                            Use as Default Address
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  <br />
                  <br />
                  <Grid container justify="flex-end" spacing={2}>
                    <Grid item xs={6} lg={2}>
                      <DangerButton
                        variant="outlined"
                        startIcon={<DeleteOutline fontSize="large" />}
                        fullWidth
                        onClick={() =>
                          this.modalStore.toggleModal(
                            'addressDelete',
                            null,
                            data.address_id,
                          )
                        }
                      >
                        <Typography variant="body1">Remove</Typography>
                      </DangerButton>
                    </Grid>
                    <Grid item xs={6} lg={2}>
                      <PrimaryWallyButton
                        startIcon={<Edit fontSize="large" />}
                        fullWidth
                        onClick={() =>
                          this.modalStore.toggleModal(
                            'addressUpdate',
                            null,
                            data.address_id,
                          )
                        }
                      >
                        <Typography variant="body1">Update</Typography>
                      </PrimaryWallyButton>
                    </Grid>
                  </Grid>
                </li>
              ))}
            </ul>
          </Container>
        </Box>

        <Box component="section">
          <Container maxWidth="xl">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h2">Payment Methods</Typography>
              <AddNewPaymentMethod />
            </Box>
            <Divider />
            {payments.length ? (
              <List>
                {payments.map((paymentMethod) => (
                  <PaymentMethod
                    key={paymentMethod._id}
                    paymentMethod={paymentMethod}
                  ></PaymentMethod>
                ))}
              </List>
            ) : (
              <Box my={2}>
                <Typography>No payment methods on file</Typography>
              </Box>
            )}
            <Box maxWidth="567px" mt={4}>
              <ApplyPromoCodeForm />
            </Box>
          </Container>
        </Box>
      </div>
    );
  }
}

export default connect('store')(Account);

function AddNewAddress() {
  const { modalV2: modalV2Store } = useStores();

  const SuspenseFallback = () => (
    <>
      <Typography variant="h1" gutterBottom>
        Add New Address
      </Typography>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  const handleAddNewAddress = () => {
    modalV2Store.open(
      <Suspense fallback={SuspenseFallback()}>
        <AddressCreateForm />
      </Suspense>,
      'left',
    );
  };

  return (
    <PrimaryTextButton onClick={handleAddNewAddress}>
      <AddIcon /> New
    </PrimaryTextButton>
  );
}

function AddNewPaymentMethod() {
  const { modalV2: modalV2Store } = useStores();
  const handleAddNewPaymentMethod = () => {
    modalV2Store.open(
      <>
        <Typography variant="h1">Add Payment Method</Typography>
        <StripeCardInput />
      </>,
    );
  };

  return (
    <PrimaryTextButton onClick={handleAddNewPaymentMethod}>
      <AddIcon /> New
    </PrimaryTextButton>
  );
}
