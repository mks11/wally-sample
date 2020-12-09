import axios from 'axios';
import { BASE_URL } from 'config';
const API_ENDPOINT = '/api/cart';

export function updateCart(cartId, data, auth = {}) {
  const url = API_ENDPOINT + '/' + cartId;
  return axios.put(url, data, { baseURL: BASE_URL, ...auth });
}
