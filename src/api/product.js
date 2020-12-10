import axios from 'axios';
import { BASE_URL } from 'config';

const GET_IMPULSE_PRODUCTS_API = BASE_URL + '/api/impulse-products';

export function getImpulseProducts(cartId, auth) {
  const url = GET_IMPULSE_PRODUCTS_API + '/' + cartId;
  return axios.get(url, { baseURL: BASE_URL, ...auth });
}
