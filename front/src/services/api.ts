import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/actions/logout';

export const HOST_API = 'http://localhost:1337/api';
export const HOST = 'http://localhost:1337';

export const api = axios.create({
    baseURL: HOST_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        store.dispatch(logout());
    } 
    return Promise.reject(error);
})