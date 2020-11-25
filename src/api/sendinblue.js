import { API_SUBSCRIBE_TO_NEWSLETTER } from '../config';
import axios from 'axios';

function subscribeToNewsletter(email) {
  return axios.post(API_SUBSCRIBE_TO_NEWSLETTER, { email });
}

export { subscribeToNewsletter };
