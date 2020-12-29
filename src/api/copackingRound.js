import axios from 'axios';
import { BASE_URL } from 'config';

export function uploadScannedProducts(auth) {
  return axios.patch(
    '/api/admin/co-packing/upload-products-adhoc',
    {},
    {
      baseURL: BASE_URL,
      ...auth,
    },
  );
}
