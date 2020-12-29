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
import { PrimaryTextButton } from 'styled-component-lib/Buttons';

// Material UI
import {
  Box,
  Container,
  Divider,
  FormGroup,
  FormControlLabel,
  List,
  Switch,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AddIcon } from 'Icons';
import { Address } from 'common/Address';

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
      showDeactivatedPaymentMethods: false,
      showDeactivatedAddresses: false,
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

  toggleActiveAddress(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.checked,
    });
  }

  toggleActivePayments(event) {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
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

    const addresses = this.state.showDeactivatedAddresses
      ? this.userStore.user.addresses
      : this.userStore.user.addresses.filter((p) => p);
    const payments = this.state.showDeactivatedPaymentMethods
      ? this.userStore.user.payment
      : this.userStore.user.payment.filter((p) => p.is_active);

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
            <Box py={2}>
              <ul className="list-addresses">
                {addresses.length ? (
                  <>
                    <Box display="flex" alignItems="center" pt={2} px={2}>
                      <AddressActivationStatusSwitch
                        onChange={(e) => this.toggleActiveAddress(e)}
                        showDeactivatedAddresses={
                          this.state.showDeactivatedAddresses
                        }
                      />
                    </Box>
                    <List>
                      {addresses.map((data, index) => (
                        <Address
                          key={data.address_id || index}
                          address={data}
                        />
                      ))}
                    </List>
                  </>
                ) : (
                  <Box my={2}>
                    <Typography gutterBottom>
                      You haven't added any addresses yet.
                    </Typography>
                  </Box>
                )}
              </ul>
            </Box>
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
              <>
                <Box display="flex" alignItems="center" pt={2} px={2}>
                  <PaymentActivationStatusSwitch
                    onChange={(e) => this.toggleActivePayments(e)}
                    showDeactivatedPaymentMethods={
                      this.state.showDeactivatedPaymentMethods
                    }
                  />
                </Box>
                <List>
                  {payments.map((paymentMethod) => (
                    <PaymentMethod
                      key={paymentMethod._id}
                      paymentMethod={paymentMethod}
                    />
                  ))}
                </List>
              </>
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
      'right',
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
        <Typography variant="h1" gutterBottom>
          Add Payment Method
        </Typography>
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

const PaymentMethodSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

//TODO DRY
const CommonSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

function PaymentActivationStatusSwitch({
  showDeactivatedPaymentMethods,
  onChange,
}) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <PaymentMethodSwitch
            checked={showDeactivatedPaymentMethods}
            onChange={onChange}
            name="showDeactivatedPaymentMethods"
          />
        }
        label="Show inactive payment methods"
      />
    </FormGroup>
  );
}

function AddressActivationStatusSwitch({ showDeactivatedAddresses, onChange }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <CommonSwitch
            checked={showDeactivatedAddresses}
            onChange={onChange}
            name="showDeactivatedAddresses"
          />
        }
        label="Show inactive addresses"
      />
    </FormGroup>
  );
}
