import axios from 'axios';
import { BASE_URL } from 'config';

// PAYMENT METHOD ENDPOINTS
const PAYMENT_METHOD_ENDPOINT = BASE_URL + '/api/user/payment';
const DEACTIVATE_PAYMENT_METHOD_ENDPOINT =
  BASE_URL + '/api/user/payment/deactivate';

export const deactivatePaymentMethod = (paymentMethodId, auth) => {
  return axios.put(
    DEACTIVATE_PAYMENT_METHOD_ENDPOINT,
    { paymentMethodId },
    auth,
  );
};

export const updatePaymentMethod = (paymentMethodId, auth) => {
  return axios.put(PAYMENT_METHOD_ENDPOINT, { paymentMethodId }, auth);
};
