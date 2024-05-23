import axios from "axios";
const BASE_URL ='http://192.168.64.1:8000/';

export const endpoints ={
    'token': '/o/token/',
    'users': '/users/'
}

export default axios.create({
    baseURL:BASE_URL
});