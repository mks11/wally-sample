import React, { useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import CheckoutCard from './BaseCheckoutCard';
import RadioGroup from 'common/RadioGroup';
import { useFormikContext } from 'formik';

function ShippingOptions({ name }) {
  const [selected, setSelected] = useState('ups_ground');

  const OPTIONS = [
    {
      value: 'ups_ground',
      name: 'UPS Ground',
      description: 'Delivery in one to five days.',
    },
  ];

  const { setFieldValue } = useFormikContext() || {};

  const handleChange = (val) => {
    setFieldValue(name, val);
    setSelected(val);
  };

  const getName = () => {
    const opt = OPTIONS.find((v) => v.value === selected);
    return opt && opt.name;
  };

  return (
    <CheckoutCard title="Shipping Options" collapsedHeight={40}>
      <Box p={1}>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
          {getName() || 'No shipping method selected.'}
        </Typography>
      </Box>
      <RadioGroup
        items={OPTIONS}
        onChange={handleChange}
        valueFn={(v) => v.value}
        Label={({ item }) => (
          <Box p={2}>
            <Typography>{item.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {item.description}
            </Typography>
          </Box>
        )}
        isChecked={(item) => item.value === selected}
      />
    </CheckoutCard>
  );
}

export default ShippingOptions;
