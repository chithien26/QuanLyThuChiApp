import axios from "axios";

<<<<<<< HEAD
const BASE_URL = 'http://172.168.10.62:8000/';
=======
const BASE_URL = 'http://192.168.1.87:8000/';
>>>>>>> eef634d1fbb10ef0cec3c5e907fa22f74fc36ebc

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
    'categoryGroup':'/category_group/',
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