import axios from 'axios';
import { BASE_URL } from 'config';

// REFERRAL ENDPOINTS
const APPLY_PROMO = BASE_URL + '/api/referral';

export const applyPromo = (promoCode, auth) => {
  return axios.post(APPLY_PROMO, { promoCode }, auth);
};
