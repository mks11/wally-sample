import axios from 'axios';
import { BASE_URL } from 'config';
const CREATE_ADDRESS_ENDPOINT = BASE_URL + '/api/user/address';

export const createAddress = (data, auth) => {
  return axios.post(CREATE_ADDRESS_ENDPOINT, data, auth);
};
