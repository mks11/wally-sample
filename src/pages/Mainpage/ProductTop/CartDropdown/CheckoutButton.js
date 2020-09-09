import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { ShoppingBasket } from '@material-ui/icons';
import PropTypes from 'prop-types';
import styles from './CheckoutButton.module.css';
import cx from 'classnames';

export default function CheckoutButton({ count, onCheckout, ...rest }) {
  return (
    <Button
      className={cx(styles.btn, count > 0 && styles.active)}
      disabled={count < 1}
      onClick={onCheckout}
      {...rest}
    >
      <ShoppingBasket className={styles.icon} />
      <Typography className={styles.items} variant="h5" component="span">
        {count} {count === 1 ? 'Item' : 'Items'}
      </Typography>
    </Button>
  );
}

CheckoutButton.propTypes = {
  count: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
