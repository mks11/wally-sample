import React from 'react';

import RadioGroup from '../RadioGroup';
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';
import CardInfo from './CardInfo';

function PaymentSelect({
  options = [],
  selectedId,
  onSelect,
  onAddPayment,
  onSubmitPayment,
}) {
  const { user: userStore } = useStores();

  const handleSelect = (payment_id) => {
    onSelect(payment_id);
  };

  //TODO
  const handleCVV = (e) => {};

  const { preferred_payment } = userStore.user;

  return (
    <>
      <RadioGroup
        items={options}
        valueFn={(v) => v._id}
        Label={({ item }) => {
          return (
            <CardInfo
              _id={item._id}
              last4={item.last4}
              exp_year={item.exp_year}
              exp_month={item.exp_month}
              isPreferred={preferred_payment === item._id}
              brand={item.brand}
            />
          );
        }}
        isChecked={(item) => item._id === selectedId}
        onChange={(v) => handleSelect(v)}
      />
    </>
  );
}

export default observer(PaymentSelect);
