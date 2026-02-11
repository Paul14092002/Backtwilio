import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const espoCrmAxios = axios.create({
    baseURL: process.env.ESPOCRM_URL,
    headers: {
        'X-Api-Key': process.env.ESPOCRM_API_KEY,
        'Content-Type': 'application/json'
    }
});

export default espoCrmAxios;
