import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1',
});
