import axios from 'axios';
import { BASE_URL } from 'config';

// REFERRAL ENDPOINTS
const APPLY_PROMO = BASE_URL + '/api/promocode';

export const applyPromo = ({ promoCode, timestamp }, auth) => {
  return axios.put(APPLY_PROMO, { promoCode, timestamp }, auth);
};

export const purchaseGiftCard = (data, auth) => {
  return axios.post('/api/giftcard', data, {
    baseURL: BASE_URL,
    ...auth,
  });
};
