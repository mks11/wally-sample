import { API_SUBSCRIBE_TO_NEWSLETTER } from '../config';

function subscribeToNewsletter(email) {
  const res = axios.post(API_SUBSCRIBE_TO_NEWSLETTER, { email });
  return res.data;
}

export { subscribeToNewsletter };
