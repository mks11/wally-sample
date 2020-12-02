import axios from 'axios';
import { BASE_URL } from 'config';

export function deleteAddress(addressId, auth) {
  return axios.delete('/api/user/address/' + addressId, {
    baseURL: BASE_URL,
    ...auth,
  });
}
