import React, { useEffect, useState } from 'react';

// API
import {
  deactivatePaymentMethod,
  reactivatePaymentMethod,
  updatePaymentMethod,
} from 'api/payment';

// Cookies
import { useCookies } from 'react-cookie';

// Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import {
  Badge,
  Box,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Grid,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Utils
import { getErrorMessage } from '../utils';

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

export const CreditCardDetails = observer(({ paymentMethod }) => {
  const { user: userStore } = useStores();
  const { brand, exp_month, exp_year, _id, is_active, last4 } = paymentMethod;
  const expMonth = exp_month.toString().padStart(2, '0');
  const expYear = exp_year.toString().slice(2);
  return (
    <Box mx={2}>
      <Typography style={{ fontWeight: 'bold' }}>
        {brand}
        {_id === userStore.user.preferred_payment && (
          <StyledBadge badgeContent="Default" color="primary" />
        )}
        {!is_active && <StyledBadge badgeContent="Inactive" color="error" />}
      </Typography>
      <Typography component="span" style={{ fontWeight: 'bold' }}>
        {last4}
      </Typography>
      <Typography
        component="span"
        color="textSecondary"
        style={{ marginLeft: '8px' }}
      >
        Expires {expMonth}/{expYear}
      </Typography>
    </Box>
  );
});

export const PaymentMethod = observer(({ paymentMethod }) => {
  const [cookies, setCookie] = useCookies(['paymentId']);
  const paymentIdCookie = cookies['paymentId'];

  const {
    loading: loadingStore,
    snackbar: snackbarStore,
    user: userStore,
  } = useStores();
  const [anchorEl, setAnchorEl] = useState(null);
  const { brand, _id, is_active } = paymentMethod;

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
      await deactivatePaymentMethod(_id, auth);
      if (_id === paymentIdCookie) {
        // Remove the user's selected payment method cookie if they decide to remove
        // the payment method it corresponds to.
        setCookie('paymentId', '', { path: '/' });
      }
      await userStore.getUser();
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

  const handleReactivatePayment = async () => {
    try {
      loadingStore.show();
      await reactivatePaymentMethod(_id, auth);
      await userStore.getUser();
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
            <CreditCardDetails paymentMethod={paymentMethod} />
          </Grid>
          <Grid item>
            <IconButton onClick={handleClick}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {is_active && (
                <MenuItem onClick={handleDefaultPayment}>Make Default</MenuItem>
              )}
              {is_active && (
                <MenuItem onClick={handleDeactivatePayment}>
                  Deactivate
                </MenuItem>
              )}
              {!is_active && (
                <MenuItem onClick={handleReactivatePayment}>
                  Reactivate
                </MenuItem>
              )}
            </Menu>
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
});

export const CreditCard = ({ my, paymentMethod }) => {
  return (
    <Box my={my || 1} display="flex" alignItems="center">
      <CreditCardLogo brand={paymentMethod.brand} />
      <CreditCardDetails paymentMethod={paymentMethod} />
    </Box>
  );
};

export function CreditCardLogo({ brand }) {
  var [logo, setLogo] = useState(undefined);
  const alt = brand ? brand + ' logo' : 'Credit card logo.';
  useEffect(() => {
    async function loadLogo() {
      const logoSVG = await getCCLogo(brand);
      if (logoSVG) {
        setLogo(logoSVG.default);
      } else setLogo(undefined);
    }
    loadLogo();
  }, [brand]);

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
        <Box
          border="1px solid #949494"
          borderRadius="4px"
          padding="1px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={logo}
            alt={alt}
            style={{ width: '32px', height: '22px', maxHeight: '32px' }}
          />
        </Box>
      ) : (
        <CreditCardIcon fontSize="large" />
      )}
    </Box>
  );
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
