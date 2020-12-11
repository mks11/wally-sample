import axios from 'axios';
import { BASE_URL } from 'config';

export const createAddress = (data, auth) => {
  const CREATE_ADDRESS_ENDPOINT = '/api/user/address';
  return axios.post(CREATE_ADDRESS_ENDPOINT, data, {
    baseURL: BASE_URL,
    ...auth,
  });
};
export function getAddress(auth) {}

export function deleteAddress(addressId, auth) {
  return axios.delete('/api/user/address/' + addressId, {
    baseURL: BASE_URL,
    ...auth,
  });
}
