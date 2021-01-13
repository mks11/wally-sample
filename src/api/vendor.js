import axios from 'axios';
import { BASE_URL } from 'config';
const API_ENDPOINT = '/api/vendor';

export function getVendor(brand, auth) {
  return axios.get(API_ENDPOINT, {
    baseURL: BASE_URL,
    ...auth,
    params: {
      urlName: brand,
    },
  });
}
