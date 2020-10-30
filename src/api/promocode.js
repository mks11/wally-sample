import axios from 'axios';
import { BASE_URL } from 'config';

// REFERRAL ENDPOINTS
const APPLY_PROMO = BASE_URL + '/api/promocode';

export const applyPromo = (promoCode, auth) => {
  return axios.put(APPLY_PROMO, { promoCode }, auth);
};
