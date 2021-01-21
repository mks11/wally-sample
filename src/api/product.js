import axios from 'axios';
import { BASE_URL } from 'config';

const GET_IMPULSE_PRODUCTS_API = BASE_URL + '/api/impulse-products';
const PRODUCTS_API_ENDPOINT = '/api/admin/retail/products';

export function getImpulseProducts(cartId, auth) {
  const url = GET_IMPULSE_PRODUCTS_API + '/' + cartId;
  return axios.get(url, { baseURL: BASE_URL, ...auth });
}

export function createProducts(filename, formData, auth) {
  return axios.post(PRODUCTS_API_ENDPOINT, formData, {
    baseURL: BASE_URL,
    headers: { ...auth.headers, 'Content-Type': 'multipart/form-data' },
    params: { filename },
  });
}

export function updateProducts(filename, formData, auth) {
  return axios.patch(PRODUCTS_API_ENDPOINT, formData, {
    baseURL: BASE_URL,
    headers: { ...auth.headers, 'Content-Type': 'multipart/form-data' },
    params: { filename },
  });
}
