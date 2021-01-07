import axios from 'axios';
import { BASE_URL } from 'config';

const ADDRESS_MANAGEMENT_ENDPOINT = '/api/user/address';

export const createAddress = (data, auth) => {
  return axios.post(ADDRESS_MANAGEMENT_ENDPOINT, data, {
    baseURL: BASE_URL,
    ...auth,
  });
};

export function getAddress(auth) {}

export function updateAddressAPI(data, auth) {
  const {
    _id,
    name,
    telephone,
    streetAddress,
    unit,
    city,
    state,
    zip,
    country,
    isPreferredAddress,
  } = data;
  if (!_id) throw new Error("Can't update address without object id.");

  const ENDPOINT = ADDRESS_MANAGEMENT_ENDPOINT + '/' + _id;
  const BODY = {
    name,
    telephone,
    streetAddress,
    unit,
    city,
    state,
    zip,
    country,
    isPreferredAddress,
  };
  return axios.patch(ENDPOINT, BODY, {
    baseURL: BASE_URL,
    ...auth,
  });
}

export function deleteAddress(addressId, auth) {
  return axios.delete('/api/user/address/' + addressId, {
    baseURL: BASE_URL,
    ...auth,
  });
}
