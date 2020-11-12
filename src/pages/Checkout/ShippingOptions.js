import React, { useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import CheckoutCard from './CheckoutCard';
import RadioGroup from './RadioGroup';
import { useFormikContext } from 'formik';

function ShippingOptions({ name }) {
  const [selected, setSelected] = useState('ups_ground');

  const OPTIONS = [
    {
      value: 'ups_ground',
      name: 'UPS Ground (1-5 days)',
    },
    {
      value: 'fedx',
      name: 'Fedex shippping',
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
    <CheckoutCard title="Shipping Options" collapsedHeight={18}>
      <Typography variant="body1"> {getName()} </Typography>
      <RadioGroup
        items={OPTIONS}
        onChange={handleChange}
        valueFn={(v) => v.value}
        Label={({ item }) => (
          <Box p={1}>
            <Typography variant="h6">{item.name}</Typography>
          </Box>
        )}
      />
    </CheckoutCard>
  );
}

export default ShippingOptions;
