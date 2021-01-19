import axios from 'axios';
import { BASE_URL } from 'config';

const GET_IMPULSE_PRODUCTS_API = BASE_URL + '/api/impulse-products';

export function getImpulseProducts(cartId, auth) {
  const url = GET_IMPULSE_PRODUCTS_API + '/' + cartId;
  return axios.get(url, { baseURL: BASE_URL, ...auth });
}

const GET_PRODUCTS_MATCHING_FILTERS_API = '/api/products/filter';

export function getProductAssortment(query, auth) {
  return axios.get(GET_PRODUCTS_MATCHING_FILTERS_API, {
    baseURL: BASE_URL,
    ...auth,
    params: {
      ...query,
    },
  });
}
