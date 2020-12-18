import axios from 'axios';
import { BASE_URL } from 'config';

// PAYMENT METHOD ENDPOINTS
const SET_PREFERRED_PAYMENT_ENDPOINT = BASE_URL + '/api/user/preferred-payment';
const PAYMENT_METHOD_ENDPOINT = BASE_URL + '/api/user/payment';

export const createPaymentMethod = (data, auth) => {
  return axios.post(PAYMENT_METHOD_ENDPOINT, data, auth);
};

export const deactivatePaymentMethod = (paymentMethodId, auth) => {
  return axios.put(
    PAYMENT_METHOD_ENDPOINT,
    { paymentMethodId, isActive: false },
    auth,
  );
};

export const reactivatePaymentMethod = (paymentMethodId, auth) => {
  return axios.put(
    PAYMENT_METHOD_ENDPOINT,
    { paymentMethodId, isActive: true },
    auth,
  );
};

export const updatePaymentMethod = (paymentMethodId, auth) => {
  return axios.put(SET_PREFERRED_PAYMENT_ENDPOINT, { paymentMethodId }, auth);
};
