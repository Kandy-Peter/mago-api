import 'dotenv/config';
import axios from 'axios';

const { PINDO_API_URL, PINDO_ACCESS_TOKEN } = process.env;

const pindoAPI = axios.create({
  baseURL: PINDO_API_URL,
  headers: {
    Authorization: `Bearer ${PINDO_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default pindoAPI;