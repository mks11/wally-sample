import { BASE_URL } from '../config';
import axios from 'axios';

const API_SUBSCRIBE_TO_NEWSLETTER = BASE_URL + '/api/email/newsletter/signup';

export function subscribeToNewsletter(email) {
  return axios.post(API_SUBSCRIBE_TO_NEWSLETTER, { email });
}
