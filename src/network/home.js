import axios from "@/network/axios";

export function getMenus() {
    return axios({
        url:'/menus'
    })
}

export function getUserList(data) {
    return axios({
        url:'/users',
        params:data
    })
}

export function userStateChanged(data) {
    return axios({
        method:'put',
        url:`users/${data.id}/state/${data.mg_state}`
    })
}

export function addUser(data) {
    return axios({
        method: 'post',
        url:'/users',
        data:data
    })
}

export function showEditDialog(id) {
    return axios({
        url:'users/'+id
    })
}

export function editUserInfo(data) {
    return axios({
        method:'put',
        url:'users/'+data.id,
        data:{
            email:data.email,
            mobile:data.mobile
        }
    })
}

export function removeUserById(id) {
    return axios({
        method:'delete',
        url:'users/'+id
    })
}