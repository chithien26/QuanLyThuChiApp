import axios from "axios";

const BASE_URL = 'http://192.168.0.104:8000/';

export const endpoints = {
    'login': '/o/token/',
    'users': '/user/',
    'groups' : '/group/',
    'register': '/user/register/',
    'current-user': '/user/current-user/',
    'addUserToGroup': (groupId) => `/group/${groupId}/add_member/`,
    'groupMember': (groupId) => `/group/${groupId}/members/`,
    'category':'/category_self/',
    'addTransactionSelf':'/transaction_self/add/',
    'transactionSelf':'/transaction_self/',
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