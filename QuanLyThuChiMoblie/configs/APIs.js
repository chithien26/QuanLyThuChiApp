import axios from "axios";
const BASE_URL ='http://192.168.0.108:8000/';

export const endpoints ={
    'token': '/o/token/',
    'users': '/users/',
    'register': '/users/register/',
}

export default axios.create({
    baseURL:BASE_URL
});