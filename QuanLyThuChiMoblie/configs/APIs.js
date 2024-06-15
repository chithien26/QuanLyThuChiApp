import axios from "axios";

const BASE_URL = 'http://172.16.1.231:8000/';

export const endpoints = {
    'login': '/o/token/',
    'users': '/users/',
    'groups' : '/groups/',
    'register': '/users/register/',
    'current-user': '/users/current-user/',
    'addUserToGroup': (groupId) => `/groups/${groupId}/add_member/`,
    'groupMember': (groupId) => `/groups/${groupId}/members/`,
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