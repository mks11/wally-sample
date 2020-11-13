import React from 'react';
import CheckoutCard from './BaseCheckoutCard';
import PaymentSelect from 'common/PaymentSelect';

export default function Payment() {
  return (
    <CheckoutCard title="Payment Options">
      <PaymentSelect />
    </CheckoutCard>
  );
}
