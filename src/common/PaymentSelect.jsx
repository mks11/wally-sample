import React from 'react';

import { observer } from 'mobx-react';

import RadioGroup from 'common/RadioGroup';
import { CreditCard } from 'common/PaymentMethods';

function PaymentSelect({ options = [], selectedId, onSelect }) {
  const handleSelect = (payment_id) => {
    onSelect(payment_id);
  };

  const activePaymentMethods = options.filter((o) => o.is_active);

  return (
    <>
      <RadioGroup
        items={activePaymentMethods}
        valueFn={(v) => v._id}
        Label={({ item }) => <CreditCard paymentMethod={item} />}
        isChecked={(item) => item._id === selectedId}
        onChange={(v) => handleSelect(v)}
      />
    </>
  );
}

export default observer(PaymentSelect);
