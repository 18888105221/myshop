import axios from "@/network/axios";

export function getRightsList() {
    return axios({
        url:'rights/list',
    })
}

export function getRolesList() {
    return axios({
        url:'roles',
    })
}

export function removeRights(role,id) {
    return axios({
        method:'delete',
        url:`roles/${role.id}/rights/${id}`
    })
}

export function showSetRightDialog() {
    return axios({
        url:'rights/tree',
    })
}

export function addRights(roleId,idStr) {
    return axios({
        method: 'post',
        url:`roles/${roleId}/rights`,
        data:{
            rids:idStr
        }
    })
}

