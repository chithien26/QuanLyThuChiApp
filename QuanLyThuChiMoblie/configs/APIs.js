import axios from "axios";

const BASE_URL = 'http://192.168.1.189:8000/';

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
    'groupsUser':'/user/groups/',
    'createGroup':'/group/create/',
    'categoryGroup': (groupId) => `/group/${groupId}/transaction_category/`,
    'addTransactionGroup': (groupId) => `/group/${groupId}/add_transaction/`,
    'transactionGroup': (groupId) => `/group/${groupId}/transaction/`,
    'userDetail':(userId)=> `/user/${userId}/`,
    'putTransaction':(transactionId)=> `/transaction_self/${transactionId}/update/`,
    'deleteTransaction':(transactionId)=> `/transaction_self/${transactionId}/`,
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