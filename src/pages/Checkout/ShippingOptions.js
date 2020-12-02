import React, { useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import CheckoutCard from './BaseCheckoutCard';
import RadioGroup from 'common/RadioGroup';
import { useFormikContext } from 'formik';
import moment from 'moment';

function ShippingOptions({ name }) {
  const [selected, setSelected] = useState('ups_ground');

  const OPTIONS = [
    {
      leastShippingDays: 1,
      mostShippingDays: 5,
      name: 'UPS Ground',
      price: '8.99',
      value: 'ups_ground',
    },
  ];

  const { setFieldValue } = useFormikContext() || {};

  const handleChange = (val) => {
    setFieldValue(name, val);
    setSelected(val);
  };

  const getSelectedShippingDates = () => {
    const option = OPTIONS.find((v) => v.value === selected);
    return option && calcDeliveryDates(option);
  };

  const calcDeliveryDates = (option) => {
    const { leastShippingDays, mostShippingDays } = option;
    // ex: Monday, January 4th
    const earliestDeliveryDay = moment()
      .add(leastShippingDays, 'd')
      .format('dddd, MMMM Do');
    const latestDeliveryDay = moment()
      .add(mostShippingDays, 'd')
      .format('dddd, MMMM Do');

    return earliestDeliveryDay + ' - ' + latestDeliveryDay;
  };

  return (
    <CheckoutCard title="Shipping Options" collapsedHeight={40} name={name}>
      <Box p={1}>
        <Typography>
          {getSelectedShippingDates() || 'No shipping method selected.'}
        </Typography>
      </Box>
      <RadioGroup
        items={OPTIONS}
        onChange={handleChange}
        valueFn={(v) => v.value}
        Label={({ item }) => (
          <Box p={2}>
            <Typography style={{ fontWeight: 'bold' }}>
              {calcDeliveryDates(item)} *
            </Typography>
            <Typography component="span">${item.price}</Typography>
            <Typography component="span"> via {item.name}</Typography>
          </Box>
        )}
        isChecked={(item) => item.value === selected}
      />
      <Typography variant="body2" color="textSecondary">
        * Delivery may take longer than usual because of COVID-19
      </Typography>
    </CheckoutCard>
  );
}

export default ShippingOptions;
