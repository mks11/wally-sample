import React from 'react';
import { Typography, Box } from '@material-ui/core';
import CollapseCard from 'common/FormikComponents/NonRenderPropAPI/CollapseCard';
import RadioGroup from 'common/RadioGroup';
import { useFormikContext } from 'formik';
import moment from 'moment';

export const OPTIONS = [
  {
    leastNumDays: 1,
    mostNumDays: 5,
    earliestDeliveryDay: moment().add(1, 'd').format('MM/DD/YY'),
    latestDeliveryDay: moment().add(5, 'd').format('MM/DD/YY'),
    name: 'UPS Ground',
    price: '8.99',
    value: 'ups_ground',
  },
];

function ShippingOptions({ onSave, name }) {
  const { values, setFieldValue } = useFormikContext() || {};
  const shippingServiceLevel = values[name];
  const collapsedHeight = 20;
  const showSaveButton = OPTIONS.length > 3;

  const handleChange = (val) => {
    setFieldValue(name, val);
  };

  const selectedShippingMethod = OPTIONS.find(
    (o) => o.value === shippingServiceLevel,
  );
  const deliveryDates = getDeliveryDates(selectedShippingMethod);

  return (
    <CollapseCard
      title="Shipping Options"
      collapsedHeight={collapsedHeight}
      elevation={0}
      name={name}
      onSave={onSave}
      showSaveButton={showSaveButton}
    >
      <Box>
        <Typography>
          {deliveryDates || 'No shipping method selected.'}
        </Typography>
      </Box>
      <RadioGroup
        items={OPTIONS}
        onChange={handleChange}
        valueFn={(v) => v.value}
        Label={({ item }) => <ShippingMethod method={item} />}
        isChecked={(item) => item.value === shippingServiceLevel}
      />
      <Box mb={showSaveButton ? 4 : 0}>
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

export function getDeliveryDates(method) {
  const { earliestDeliveryDay, latestDeliveryDay } = method;
  return 'Get it between ' + earliestDeliveryDay + ' and ' + latestDeliveryDay;
}

const ShippingMethod = ({ method }) => {
  const { leastNumDays, mostNumDays, name, price } = method;
  return (
    <Box p={2}>
      <Typography style={{ fontWeight: 'bold' }}>{name}</Typography>
      <Typography color="textSecondary">
        Delivery in {leastNumDays} to {mostNumDays} days*
      </Typography>
      <Typography>${price}</Typography>
    </Box>
  );
};
