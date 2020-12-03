import React from 'react';

import { observer } from 'mobx-react';

import {
  Box,
  Divider,
  makeStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { CreditCard } from 'common/PaymentMethods';

function PaymentSelect({ name, onChange, paymentMethods = [], selected }) {
  const activePaymentMethods = paymentMethods.filter((o) => o.is_active);
  const handleSelect = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <RadioGroup
        aria-label={'payment-methods'}
        name={name}
        onChange={handleSelect}
      >
        {activePaymentMethods.map((paymentMethod) => (
          <PaymentRadioButton
            key={paymentMethod._id}
            paymentMethod={paymentMethod}
            selected={selected}
            value={paymentMethod._id}
          />
        ))}
      </RadioGroup>
    </>
  );
}

export default observer(PaymentSelect);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: '100%',
  },
}));

function PaymentRadioButton({ paymentMethod, selected, value }) {
  const classes = useStyles();
  const isSelected = value === selected._id;

  return (
    <Box display="flex">
      <FormControlLabel
        control={<Radio color="primary" />}
        classes={{ root: classes.root, label: classes.label }}
        value={value}
        checked={isSelected}
        label={<CreditCard paymentMethod={paymentMethod} />}
      />
      <Divider />
    </Box>
  );
}
