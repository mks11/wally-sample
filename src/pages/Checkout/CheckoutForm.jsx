import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DeliveryAddressOptions from './FormikDeliveryAddressOptions';

export default function CheckoutForm() {
  return (
    <Formik
      initialValues={{
        addressId,
        shippingServiceLevel: 'ups_ground',
        paymentId,
      }}
      validationSchema={{
        addressId: Yup.string(),
        shippingServiceLevel: Yup.string().isRequired(),
        paymentId: Yup.string(),
      }}
      enableReinitialize
    >
      <DeliveryAddressOptions name="addressId" />
      <PrimaryWallyButton type="submit">Checkout</PrimaryWallyButton>
    </Formik>
  );
}
