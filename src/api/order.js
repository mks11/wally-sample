import axios from 'axios';
import { BASE_URL } from 'config';

// Helpers
import { getTimestamp } from 'helpers/date';

export function submitOrder(data, auth) {
  const timestamp = getTimestamp();
  return axios.post('/api/order', data, {
    baseURL: BASE_URL,
    ...auth,
    params: { timestamp },
  });
}
