import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const espoCrmAxios = axios.create({
    baseURL: process.env.ESPOCRM_URL,
    headers: {
        'X-Api-Key': process.env.ESPOCRM_API_KEY,
        'Content-Type': 'application/json'
    },
    timeout: 10000 
});

espoCrmAxios.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ Error en EspoCRM API:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

export default espoCrmAxios;
