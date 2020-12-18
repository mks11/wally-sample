import React from 'react';
import { Link } from 'react-router-dom';

// Cookies
import { useCookies } from 'react-cookie';

// Material UI
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

const CheckoutFlowBreadcrumbs = ({ breadcrumbs, location }) => {
  const theme = useTheme();
  const [cookies] = useCookies([
    'addressId',
    'shippingServiceLevel',
    'paymentId',
  ]);
  const { addressId, paymentId, shippingServiceLevel } = cookies;

  const { checkout } = useStores();
  const { cart } = checkout;

  if (breadcrumbs.length <= 1) return null;
  return (
    <Box my={4}>
      {/* Link back to any previous steps of the breadcrumb. */}
      {breadcrumbs.map(({ name, path }, idx) => {
        const isCurrentPath = location.pathname.includes(name) ? true : false;
        const shippingIsDisabled =
          cart && cart.cart_items && !cart.cart_items.length;

        // Disable payment link if addressId or shipping cookies not set
        const paymentIsDisabled =
          (!addressId || !shippingServiceLevel) && name === 'payment';

        // Disable review link if addressId or shipping or paymentId cookies not set
        const reviewIsDisabled =
          (!addressId || !shippingServiceLevel || !paymentId) &&
          name === 'review';

        return (
          <Box component="span" key={name}>
            <Box component="span" mr={1}>
              {isCurrentPath ||
              shippingIsDisabled ||
              paymentIsDisabled ||
              reviewIsDisabled ? (
                <Typography
                  component="span"
                  color={isCurrentPath ? 'textPrimary' : 'textSecondary'}
                >
                  {name}
                </Typography>
              ) : (
                <Link to={path} style={{ color: theme.palette.primary.main }}>
                  <Typography component="span">{name}</Typography>
                </Link>
              )}
            </Box>
            {idx < breadcrumbs.length - 1 ? (
              <Box component="span" mr={1}>
                &gt;
              </Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};

export default observer(CheckoutFlowBreadcrumbs);
