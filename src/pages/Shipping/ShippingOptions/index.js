import React, { useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import CollapseCard from 'common/FormikComponents/NonRenderPropAPI/CollapseCard';
import RadioGroup from 'common/RadioGroup';
import { useFormikContext } from 'formik';
import moment from 'moment';

function ShippingOptions({ onSave, name }) {
  const OPTIONS = [
    {
      leastShippingDays: 1,
      mostShippingDays: 5,
      name: 'UPS Ground',
      price: '8.99',
      value: 'ups_ground',
    },
  ];

  const { values, setFieldValue } = useFormikContext() || {};
  const shippingServiceLevel = values[name];
  const collapsedHeight = shippingServiceLevel ? 50 : 50;

  const handleChange = (val) => {
    setFieldValue(name, val);
  };

  const getSelectedShippingDates = () => {
    const option = OPTIONS.find((v) => v.value === shippingServiceLevel);
    return option && calcDeliveryDates(option);
  };

  const calcDeliveryDates = (option) => {
    if (!option) return;
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
    <CollapseCard
      title="Shipping Options"
      collapsedHeight={collapsedHeight}
      onSave={onSave}
      name={name}
      showSaveButton
    >
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
        isChecked={(item) => item.value === shippingServiceLevel}
      />
      <Box mb={4}>
        <Typography variant="body2" color="textSecondary">
          * Delivery may take longer than usual due to increased shipping lead
          times caused by COVID-19. For more information, visit{' '}
          <a
            href="https://www.ups.com/us/en/about/news/important-updates.page"
            target="blank"
            rel="noopener noreferrer"
          >
            UPS
          </a>
          .
        </Typography>
      </Box>
    </CollapseCard>
  );
}

export default ShippingOptions;
