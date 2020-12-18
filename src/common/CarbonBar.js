import React from 'react';

import { getItemsCount } from 'utils';
import { Typography } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';
function CarbonBar() {
  const { checkout } = useStores();
  const { cart } = checkout;
  const items = cart ? cart.cart_items : [];
  const count = getItemsCount(items);

  const getFeedback = () => {
    return ` ${count ? 12 - (count % 12) : 12} jars from fully minimizing
          your carbon footprint`;
  };

  const getWidthInPercent = () => {
    const percent = (count % 12) * (100 / 12);
    return `${percent}%`;
  };

  return (
    <div className="carbon-bar-wrapper">
      <div>
        <Typography>{getFeedback()}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Each of our totes holds up to 12 jars.
        </Typography>
      </div>
      <div className="carbon-bar">
        <div
          className="carbon-bar-value"
          style={{ width: getWidthInPercent() }}
        />
      </div>
    </div>
  );
}

export default observer(CarbonBar);
