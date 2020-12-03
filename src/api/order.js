import axios from 'axios';
import { BASE_URL } from 'config';

export function submitOrder(data, auth) {
  return axios.post('/api/order', data, {
    baseURL: BASE_URL,
    ...auth,
  });
}
