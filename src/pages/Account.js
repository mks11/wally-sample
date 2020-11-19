import React, { Component, useEffect, useState } from 'react';

// API
import { deactivatePaymentMethod, updatePaymentMethod } from 'api/payment';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Utils
import { connect, getErrorMessage } from '../utils';

import { Input } from 'reactstrap';
import Title from '../common/page/Title';
import AddressModal from './account/AddressModal';
import ApplyPromoCodeForm from 'forms/ApplyPromoCodeForm';
import StripeCardInput from 'common/StripeCardInput';
import {
  PrimaryTextButton,
  PrimaryWallyButton,
  DangerButton,
} from 'styled-component-lib/Buttons';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Grid,
  Typography,
} from '@material-ui/core';
import { Edit, DeleteOutline } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

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

        <section className="page-section aw-account--address pt-2">
          <div className="container">
            <Typography variant="h2">Addresses</Typography>
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
            <button
              className="btn btn-icon-transparent mt-4"
              onClick={(e) => this.userStore.showAddressModal()}
            >
              <i className="ico ico-add-circle mr-3"></i>Add new address
            </button>
          </div>
        </section>

        <Box component="section">
          <Container maxWidth="xl">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
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

        {this.userStore.addressModalOpen ? <AddressModal /> : null}
      </div>
    );
  }
}

export default connect('store')(Account);

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

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -40,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '8px',
    color: '#FFF',
    fontFamily: ['Sofia Pro', 'sans-serif'].join(),
    fontWeight: 'bold',
  },
}))(Badge);

const PaymentMethod = observer(({ paymentMethod }) => {
  const {
    loading: loadingStore,
    snackbar: snackbarStore,
    user: userStore,
  } = useStores();
  const [anchorEl, setAnchorEl] = useState(null);
  const { brand, exp_month, exp_year, _id, last4 } = paymentMethod;
  const expMonth = exp_month.padStart(2, '0');
  const expYear = exp_year.slice(2);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // API
  const auth = userStore.getHeaderAuth();
  const handleDefaultPayment = async () => {
    try {
      loadingStore.show();
      const res = await updatePaymentMethod(_id, auth);
      userStore.setUserData(res.data);
    } catch (error) {
      const msg = getErrorMessage(error);
      if (msg) snackbarStore.openSnackbar(msg, 'error');
      else {
        snackbarStore.openSnackbar("Couldn't set default payment.", 'error');
      }
    } finally {
      handleClose();
      loadingStore.hide();
    }
  };

  const handleDeactivatePayment = async () => {
    try {
      loadingStore.show();
      const res = await deactivatePaymentMethod(_id, auth);
      userStore.setUserData(res.data);
    } catch (error) {
      const msg = getErrorMessage(error);
      if (msg) snackbarStore.openSnackbar(msg, 'error');
      else {
        snackbarStore.openSnackbar(
          "Couldn't deactivate payment method.",
          'error',
        );
      }
    } finally {
      loadingStore.hide();
    }
  };

  return (
    <Box my={2}>
      <ListItem>
        <CreditCardLogo brand={brand} />
        <Grid container justify="space-between">
          <Grid item>
            <Box mx={2}>
              <Typography style={{ fontWeight: 'bold' }}>
                {brand}
                {_id === userStore.user.preferred_payment && (
                  <StyledBadge badgeContent="Default" color="primary" />
                )}
              </Typography>
              <Typography component="span" style={{ fontWeight: 'bold' }}>
                **** {last4}
              </Typography>
              <Typography
                component="span"
                color="textSecondary"
                style={{ marginLeft: '8px' }}
              >
                Expires {expMonth}/{expYear}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <IconButton disableRipple onClick={handleClick}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDefaultPayment}>Make Default</MenuItem>
              <MenuItem onClick={handleDeactivatePayment}>Remove</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
});

function CreditCardLogo({ brand }) {
  var [logo, setLogo] = useState(undefined);
  const alt = brand ? brand + ' logo' : 'Credit card logo.';
  useEffect(() => {
    loadLogo();
  }, []);

  return (
    <Box
      height="36px"
      maxHeight="36px"
      width="36px"
      maxWidth="36px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {logo ? (
        <Box border="2px solid #949494" borderRadius="4px" padding="2px">
          <img
            src={logo}
            alt={alt}
            style={{ width: '32px', maxHeight: '32px' }}
          />
        </Box>
      ) : (
        <CreditCardIcon fontSize="large" />
      )}
    </Box>
  );

  async function loadLogo() {
    const logoSVG = await getCCLogo(brand);
    if (logoSVG) {
      setLogo(logoSVG.default);
    }
  }
}

// Uses code splitting techniques to grab the correct logo.
function getCCLogo(brand) {
  try {
    var logo = null;
    switch (brand) {
      case 'American Express':
        logo = import('images/amex-36.svg');
        break;
      case 'Discover':
        logo = import('images/discover-36.svg');
        break;
      case 'MasterCard':
        logo = import('images/mastercard-36.svg');
        break;
      case 'Visa':
        logo = import('images/visa-36.svg');
        break;
      default:
        logo = null;
        break;
    }
  } catch (error) {
    console.error(error);
  }

  return logo;
}
