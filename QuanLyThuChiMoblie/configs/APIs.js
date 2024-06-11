import axios from "axios";

const BASE_URL = 'http://192.168.0.105:8000/';

export const endpoints = {
    'login': '/o/token/',
    'users': '/users/',
    'register': '/users/register/',
    'current-user': '/users/current-user/',
}

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});